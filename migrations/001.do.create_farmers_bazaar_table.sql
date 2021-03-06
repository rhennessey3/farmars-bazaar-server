CREATE TABLE userlogin (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (225) NOT NULL);


CREATE TABLE vendors (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    vendor_short_description TEXT NOT NULL,
    streetaddress TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip INTEGER NOT NULL,
    phone INTEGER NOT NULL,
    email TEXT NOT NULL);


CREATE TABLE vendorinventoryitems (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    item_name TEXT NOT NULL,
    item_description TEXT NOT NULL,
    item_count INTEGER NOT NULL,
    item_price INTEGER NOT NULL,
    item_img TEXT NOT NULL,
    vendor_id INTEGER REFERENCES userlogin(id),
    date_created TIMESTAMP DEFAULT now() NOT NULL);


INSERT INTO public.userlogin (user_name,"password") VALUES
('demo@gmail.com','$2a$12$9j6A6wxbKIP8IQWwHExsue5kimTsdwzOSTJa/kusQN69u1lm0J856') ,
('user@gmail.com','$2a$12$KI8Mth8npH21ez6SCBy.pOli8jVI0IF5Z9dWj/JQWUA2ATi8IoQam') ;