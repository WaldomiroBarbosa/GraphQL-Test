var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var { ruruHTML } = require("ruru/server")
var fs = require("fs");
 
var app = express()

var schema = buildSchema(/* GraphQL */`
    type User 
    {
        _id: ID!
        username: String!
        pwuser: String!
    }

    type Query 
    {
    basic(numA: Int!, numB: Int): [Int]
    change(textM: String!): String
    searchUsers: [User!]!
    }

    type Mutation 
    {
    replaceText(newContent: String!): String
    }
`)
 
var root = {
    basic ({ numA, numB }) 
    {
      var output = []
      output.push(numA + numB)
      output.push(numA - numB)
      output.push(numA * numB)
      output.push(numA / numB)
      return output
    },
    change ( {textM} )
    {
        return textM.toUpperCase()
    },
    replaceText: ({ newContent }) => {
        try {
            filePath = "./archive.txt"
            let fileContent = fs.readFileSync(filePath, "utf8")
            fileContent = fileContent.replace(/.*/, newContent)
            fs.writeFileSync(filePath, fileContent, "utf8")
    
          return "Success";

        } catch (error) {

          console.error("Error:", error);
          return "Error.";

        }
      },
  }
 

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  }),
)

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
  })

app.listen(4000)
console.log("Running a GraphQL API server at localhost:4000/graphql")