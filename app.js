//jshint esversion:6

// imports
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

// declaration
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// static files
app.use(express.static("public"))

// set views
app.set('view engine', 'ejs');

// Connect to a new database
mongoose.connect("mongodb://localhost:27017/wikiDB");

// Create a new Schema that contains a title and content.
const articleSchema = {
  title: String,
  content: String
}

// Use schema to create mongoose model
const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////// REQUESTS TARGETING ALL ARTICLES ///////////////////////////////////

app.route('/articles')

// Fetches all the articles
.get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

// Send data via API
.post(function(req,res) {
    // creates a new article
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    // check documentation
    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article.")
        } else {
            res.send(err);
        }
    });
})

// Deletes all the articles
.delete(function(req, res) {
    Article.deleteMany({}, function(err) {
        if (!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});


/////////////////////////////////// REQUESTS TARGETING A SPECIFIC ARTICLE ///////////////////////////////////

app.route('/articles/:articleTitle')

// READ data from specific resource
.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle)
        } else {
            res.send("No articles matching that title was found");
        }
    });
})

// PUT (UPDATE everything) data from specific resource
// update deprecated USE replaceOne
.put(function(req, res) {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                console.log(err);
            }
        }
   );
})

// PATCH (UPDATE only the field specified) data from specific resource
.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}, 
        function(err) {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
    })
})

// DELETE data from specific resource
.delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if (!err) {
            res.send("Successfully deleted the corresponding article.");
        } else {
            res.send(err);
        }
    })
});

// Listen on port 5000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});