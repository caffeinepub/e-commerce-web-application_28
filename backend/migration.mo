import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";

module {
  type Category = {
    #electronics;
    #clothing;
    #homeKitchen;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  type LegacyProduct = {
    id : Nat;
    name : Text;
    description : Text;
    category : Category;
    priceUsd : Nat;
    stockQty : Nat;
    image : Blob;
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Category;
    priceUsd : Nat;
    stockQty : Nat;
    image : { name : Text; url : Text; mimeType : Text };
  };

  type OrderItem = {
    productId : Nat;
    quantity : Nat;
    unitPrice : Nat;
  };

  type Order = {
    id : Nat;
    userId : Principal;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    createdAt : Int;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
    unitPrice : Nat;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    nextProductId : Nat;
    nextOrderId : Nat;
    products : Map.Map<Nat, LegacyProduct>;
    orders : Map.Map<Nat, Order>;
    carts : Map.Map<Principal, [CartItem]>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = {
    nextProductId : Nat;
    nextOrderId : Nat;
    products : Map.Map<Nat, Product>;
    orders : Map.Map<Nat, Order>;
    carts : Map.Map<Principal, [CartItem]>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  let sampleProducts : [(Nat, Product)] = [
    (
      1,
      {
        id = 1;
        name = "Wireless Headphones";
        description = "Noise-cancelling over-ear headphones with long battery life.";
        category = #electronics;
        priceUsd = 12000;
        stockQty = 50;
        image = {
          name = "headphones.jpg";
          url = "https://example.com/images/headphones.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      2,
      {
        id = 2;
        name = "Men's Jacket";
        description = "Water-resistant lightweight jacket for all seasons.";
        category = #clothing;
        priceUsd = 8500;
        stockQty = 80;
        image = {
          name = "jacket.jpg";
          url = "https://example.com/images/jacket.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      3,
      {
        id = 3;
        name = "Smart LED Bulb";
        description = "Energy-efficient LED bulb with WiFi connectivity and voice control.";
        category = #homeKitchen;
        priceUsd = 3500;
        stockQty = 200;
        image = {
          name = "bulb.jpg";
          url = "https://example.com/images/bulb.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      4,
      {
        id = 4;
        name = "Bluetooth Speaker";
        description = "Portable wireless speaker with deep bass and 12-hour playtime.";
        category = #electronics;
        priceUsd = 6500;
        stockQty = 100;
        image = {
          name = "speaker.jpg";
          url = "https://example.com/images/speaker.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      5,
      {
        id = 5;
        name = "Women's Yoga Pants";
        description = "High-waist, stretchable yoga pants for fitness and casual wear.";
        category = #clothing;
        priceUsd = 4000;
        stockQty = 120;
        image = {
          name = "yoga_pants.jpg";
          url = "https://example.com/images/yoga_pants.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      6,
      {
        id = 6;
        name = "Non-stick Pan Set";
        description = "3-piece non-stick frying pan set with heat-resistant handles.";
        category = #homeKitchen;
        priceUsd = 9500;
        stockQty = 60;
        image = {
          name = "pan_set.jpg";
          url = "https://example.com/images/pan_set.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      7,
      {
        id = 7;
        name = "Wireless Mouse";
        description = "Ergonomic wireless mouse with adjustable DPI settings.";
        category = #electronics;
        priceUsd = 2200;
        stockQty = 150;
        image = {
          name = "mouse.jpg";
          url = "https://example.com/images/mouse.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      8,
      {
        id = 8;
        name = "Insulated Water Bottle";
        description = "Stainless steel bottle, keeps drinks cold for 24 hours.";
        category = #homeKitchen;
        priceUsd = 3000;
        stockQty = 95;
        image = {
          name = "water_bottle.jpg";
          url = "https://example.com/images/water_bottle.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      9,
      {
        id = 9;
        name = "Men's Running Shoes";
        description = "Lightweight, breathable sneakers with cushioned soles.";
        category = #clothing;
        priceUsd = 7000;
        stockQty = 70;
        image = {
          name = "running_shoes.jpg";
          url = "https://example.com/images/running_shoes.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
    (
      10,
      {
        id = 10;
        name = "Bluetooth Earbuds";
        description = "Waterproof wireless earbuds with charging case and touch controls.";
        category = #electronics;
        priceUsd = 4000;
        stockQty = 110;
        image = {
          name = "earbuds.jpg";
          url = "https://example.com/images/earbuds.jpg";
          mimeType = "image/jpeg";
        };
      },
    ),
  ];

  public func run(_old : OldActor) : NewActor {
    let initialProducts = Map.fromIter<Nat, Product>(sampleProducts.values());
    {
      nextProductId = 11;
      nextOrderId = 1;
      products = initialProducts;
      orders = Map.empty<Nat, Order>();
      carts = Map.empty<Principal, [CartItem]>();
      userProfiles = Map.empty<Principal, UserProfile>();
    };
  };
};
