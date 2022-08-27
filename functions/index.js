const functions = require("firebase-functions");
// const getAuth = require("firebase-auth")
// const connectAuthEmulator = require("firebase-auth")
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// const auth = getAuth();
// connectAuthEmulator(auth, "http://localhost:9099");


exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});


// creates a standard API endpoint onRequest
exports.addMessage = functions.https.onRequest((req, res) => {
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = admin.firestore().collection("messages").doc("allcode")
        .set({ original: "original" });
    // Send back a message that we've successfully written the message
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// trigger function create doc
exports.createProduct = functions.firestore
    .document("product/{productId}")
    .onCreate((snap, context) => {
        const newValue = snap.data();
        console.log(newValue);
        // access a particular field as you would any JS property
        const title = newValue.title;
        const description = newValue.description;
        const productNumber = newValue.productNumber;
        const model = newValue.model;
        const price = newValue.price;
        const status = newValue.status;
        const createdAt = newValue.createdAt;
        console.log(
            title,
            description,
            productNumber,
            model,
            price,
            status,
            createdAt
        );
        // perform desired operations ...
        // const experience = snap.get("experience");
        // console.log("experience");
    });

// trigger function onUpdate doc
exports.updateProduct = functions.firestore
    .document("product/{productId}")
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        // ...or the previous value before this update
        const previousValue = change.before.data();
        console.log(previousValue);
        // access a particular field as you would any JS property
        const price = newValue.price;
        const status = newValue.status;
        console.log(price, status);
        // perform desired operations ...
    });

// trigger function onDelete doc
exports.deleteProduct = functions.firestore
    .document("product/{productID}")
    .onDelete((snap, context) => {
        const deletedValue = snap.data();
        // perform desired operations ..
    });

//Trigger a function for all changes to a document
exports.modifyProduct = functions.firestore
    .document("product/{productID}")
    .onWrite((change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const document = change.after.exists ? change.after.data() : null;
        // Get an object with the previous document value (for update or delete)
        console.log(document);
        const oldDocument = change.before.data();
        // perform desired operations ...
        console.log(oldDocument);
    });

// trigger function onWrite doc (Listen for any change on document `user id` in collection `users`)
exports.myFunctionName = functions.firestore
    .document("product/{productId}")
    .onWrite((change, context) => {
        // const newValue = change.data();
        // console.log(newValue)
        //console.log("product");
        const document = change.after.data();
        console.log(document);
        const oldDoc = change.before.data();
        console.lgo(oldDoc);
    });

// Listen for updates to any `user` document.(Writing data)
exports.countNameChanges = functions.firestore
    .document("users/{userId}")
    .onUpdate((change, context) => {
        // Retrieve the current and previous value
        const data = change.after.data();
        const previousData = change.before.data();
        // We'll only update if the name has changed.
        // This is crucial to prevent infinite loops.
        if (data.name == previousData.name) {
            return null;
        }
        // Retrieve the current count of name changes
        let count = data.name_change_count;
        if (!count) {
            count = 0;
        }
        // Then return a promise of a set operation to update the count
        return change.after.ref.set({
            name_change_count: count + 1,
        }, { merge: true });
    });

// Listen for changes in all documents in the 'users' collection and all subcollections
// exports.useMultipleWildcards = functions.firestore
//      .document('users/{userId}/{messageCollectionId}/{messageId}')
//      .onWrite((change, context) => {
// //       // If we set `/users/marie/incoming_messages/134` to {body: "Hello"} then
// //       context.params.userId == "";
// //        context.params.messageCollectionId == "incoming_messages";
// //       context.params.messageId == "134";
// //       // ... and ...
//        change.after.data() == {body: "Hello"}
//      });

// uppercase onCreate.
exports.makeUppercase = functions.firestore
    .document("/messages/{documentId}")
    .onCreate((snap, context) => {
        // Grab the current value of what was written to Firestore.
        const original = snap.data().original;
        // Access the parameter `{documentId}` with `context.params`
        functions.logger.log("Uppercasing", context.params.documentId, original);
        const uppercase = original.toUpperCase();
        return snap.ref.set({ uppercase }, { merge: true });
    });




// user create
exports.createUser = functions.firestore
    .document("user/{userId}")
    .onCreate((snap, context) => {
        const newValue = snap.data();
        console.log(newValue);

        const name = newValue.name;
        const email = newValue.email;
        const password = newValue.password;
        console.log(name, email, password);
    });
// authentication for welcome mail
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    const email = user.email; // The email of the user.
    const name = user.name; // The display name of the user.
    console.log(email, name)
});
// authentication for logout mail
exports.sendByEmail = functions.auth.user().onDelete((user) => {
    const email = user.email; // The email of the user.
    const name = user.name; // The display name of the user.
    console.log(email, name)
});