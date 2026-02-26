import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";

import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
actor {
  module Product {
    public type Category = {
      #electronics;
      #clothing;
      #homeKitchen;
    };

    public type Product = {
      id : Nat;
      name : Text;
      description : Text;
      category : Category;
      priceUsd : Nat;
      stockQty : Nat;
      image : { name : Text; url : Text; mimeType : Text };
    };

    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module OrderModule {
    public type Status = {
      #pending;
      #processing;
      #shipped;
      #delivered;
      #cancelled;
    };

    public type OrderItem = {
      productId : Nat;
      quantity : Nat;
      unitPrice : Nat;
    };

    public type Order = {
      id : Nat;
      userId : Principal;
      items : [OrderItem];
      totalAmount : Nat;
      status : Status;
      createdAt : Time.Time;
    };

    public func compare(o1 : Order, o2 : Order) : Order.Order {
      if (o1.createdAt < o2.createdAt) { #less }
      else if (o1.createdAt > o2.createdAt) { #greater } else {
        Nat.compare(o1.id, o2.id);
      };
    };
  };

  module Cart {
    public type CartItem = {
      productId : Nat;
      quantity : Nat;
      unitPrice : Nat;
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var nextProductId = 11;
  var nextOrderId = 1;

  let products = Map.empty<Nat, Product.Product>();
  let orders = Map.empty<Nat, OrderModule.Order>();
  let carts = Map.empty<Principal, [Cart.CartItem]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management

  public shared ({ caller }) func createProduct(name : Text, description : Text, category : Product.Category, priceUsd : Nat, stockQty : Nat, image : { name : Text; url : Text; mimeType : Text }) : async Product.Product {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let product : Product.Product = {
      id = nextProductId;
      name;
      description;
      category;
      priceUsd;
      stockQty;
      image;
    };

    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, category : Product.Category, priceUsd : Nat, stockQty : Nat, image : { name : Text; url : Text; mimeType : Text }) : async Product.Product {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_existing) {
        let updated : Product.Product = {
          id;
          name;
          description;
          category;
          priceUsd;
          stockQty;
          image;
        };
        products.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) { products.remove(id) };
    };
  };

  // Product reads are public — no auth check needed
  public query func getProduct(id : Nat) : async Product.Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func listProducts() : async [Product.Product] {
    products.values().toArray().sort();
  };

  // Cart Management

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can add to cart");
    };

    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { [] : [Cart.CartItem] };
      case (?cart) { cart };
    };

    let newItem : Cart.CartItem = {
      productId;
      quantity;
      unitPrice = product.priceUsd;
    };

    let updatedCart = currentCart.concat([newItem]);
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can modify their cart");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { [] : [Cart.CartItem] };
      case (?cart) { cart };
    };

    let updatedCart = currentCart.filter(func(item : Cart.CartItem) : Bool { item.productId != productId });
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can clear their cart");
    };
    carts.remove(caller);
  };

  public query ({ caller }) func getCart() : async [Cart.CartItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view their cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  // Order Management

  public shared ({ caller }) func placeOrder() : async OrderModule.Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?c) { c };
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let totalAmount = cart.foldLeft(0, func(acc : Nat, item : Cart.CartItem) : Nat { acc + (item.quantity * item.unitPrice) });

    let order : OrderModule.Order = {
      id = nextOrderId;
      userId = caller;
      items = cart.map(func(item : Cart.CartItem) : OrderModule.OrderItem { { productId = item.productId; quantity = item.quantity; unitPrice = item.unitPrice } });
      totalAmount;
      status = #pending;
      createdAt = Time.now();
    };

    orders.add(nextOrderId, order);
    carts.remove(caller);
    nextOrderId += 1;

    order;
  };

  public query ({ caller }) func getOrder(id : Nat) : async OrderModule.Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Only the order owner or an admin can view the order
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getOrderHistory() : async [OrderModule.Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access order history");
    };

    let userOrders = orders.values().toArray().filter(func(order : OrderModule.Order) : Bool { order.userId == caller });
    userOrders.sort();
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : OrderModule.Status) : async OrderModule.Order {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updated : OrderModule.Order = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          totalAmount = order.totalAmount;
          status;
          createdAt = order.createdAt;
        };
        orders.add(id, updated);
        updated;
      };
    };
  };

  // Admin: list all orders
  public query ({ caller }) func listAllOrders() : async [OrderModule.Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list all orders");
    };
    orders.values().toArray().sort();
  };
};
