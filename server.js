require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  uploads: false,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    } else {
      const {
        connection: { context },
      } = ctx;
      return {
        loggedInUser: context.loggedInUser,
      };
    }
  },
  subscriptions: {
    // onConnect는 connection되는 순간 context에 HTTP header를 준다.  === 아래 리턴한 loggedInUser는 위에 ctx.connection.context.loggedInUser로 간다.
    // 웹소켓으로 연결할 때 딱 한 번만 불려진다.
    // http request일때는 상관없지만 subscription이 웹소켓을 쓰는데 웹소켓에는 request가 없다.
    // 이렇게 context에 전달하면 subscribe(웹소켓)에서 context를 쓸 수 있다.
    onConnect: async ({ token }) => {
      if (!token) {
        throw new Error("You can't listen.");
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser,
      };
    },
  },
});

const app = express();
app.use(logger("tiny"));
app.use(graphqlUploadExpress());
apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}/`);
});
