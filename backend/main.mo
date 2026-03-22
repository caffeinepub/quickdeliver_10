import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : ?Text;
    availability : Bool; // true = in stock
  };

  public type LineItem = {
    productId : Nat;
    nameSnapshot : Text;
    unitPriceSnapshot : Float;
    quantity : Nat;
  };

  public type OrderStatus = {
    #placed;
    #preparing;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  public type Order = {
    orderId : Nat;
    userPrincipal : Principal;
    items : [LineItem];
    deliveryAddress : Text;
    contactPhone : Text;
    createdAt : Int;
    status : OrderStatus;
  };

  public type CreateOrderInput = {
    items : [LineItem];
    deliveryAddress : Text;
    contactPhone : Text;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  // State
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextOrderId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize default products
  public shared ({ caller }) func initProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    products.add(
      1,
      {
        id = 1;
        name = "Pizza Margherita";
        description = "Classic Italian pizza with tomato, mozzarella, and basil";
        price = 12.99;
        category = "Pizza";
        imageUrl = ?"/images/pizza_margherita.jpg";
        availability = true;
      },
    );
    products.add(
      2,
      {
        id = 2;
        name = "Veggie Burger";
        description = "Grilled plant-based patty with lettuce, tomato & vegan cheese";
        price = 10.5;
        category = "Burger";
        imageUrl = ?"/images/veggie_burger.jpg";
        availability = true;
      },
    );
    products.add(
      3,
      {
        id = 3;
        name = "Caesar Salad";
        description = "Romaine lettuce, croutons & vegan Caesar dressing";
        price = 9.99;
        category = "Salad";
        imageUrl = ?"/images/caesar_salad.jpg";
        availability = true;
      },
    );
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Products - Public access (no auth required)
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Orders - User authentication required
  public shared ({ caller }) func createOrder(input : CreateOrderInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let orderId = nextOrderId;
    let newOrder : Order = {
      orderId;
      userPrincipal = caller;
      items = input.items;
      deliveryAddress = input.deliveryAddress;
      contactPhone = input.contactPhone;
      createdAt = Time.now();
      status = #placed;
    };
    orders.add(orderId, newOrder);
    nextOrderId += 1;
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.userPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getOrderStatus(orderId : Nat) : async Text {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.userPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        switch (order.status) {
          case (#placed) { "Placed" };
          case (#preparing) { "Preparing" };
          case (#outForDelivery) { "Out for delivery" };
          case (#delivered) { "Delivered" };
          case (#cancelled) { "Cancelled" };
        };
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let existingOrder = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?foundOrder) { foundOrder };
    };

    let updatedOrder = {
      existingOrder with
      status = newStatus
    };

    orders.add(orderId, updatedOrder);
  };
};
