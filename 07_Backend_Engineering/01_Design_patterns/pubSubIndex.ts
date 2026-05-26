//* nodemon pubSubIndex.ts
import PubSub from "./pubsub";

const pubsub = new PubSub();

type UserCreatedEvent = {
  id: number;
  name: string;
};

// Subscriber #1
const unsubscribeEmail = pubsub.subscribe<UserCreatedEvent>("user.created", (user) => {
  console.log(`📧 Sending welcome email to ${user.name}`);
});

// Subscriber #2
pubsub.subscribe<UserCreatedEvent>("user.created", (user) => {
  console.log(`📊 Tracking analytics for user ${user.id}`);
});

// Publisher
pubsub.publish<UserCreatedEvent>("user.created", {
  id: 1,
  name: "Alice",
});

// Unsubscribe one listener
unsubscribeEmail();

console.log("\nAfter unsubscribe:\n");

// Publish again
pubsub.publish<UserCreatedEvent>("user.created", {
  id: 2,
  name: "Bob",
});
