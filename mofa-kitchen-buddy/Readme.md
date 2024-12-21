# Mofa's Kitchen Buddy

## API Documentation

The txt file is used as RAG source. The langchain api is connected to mongoose. So the chatbot can be used to interact with the database and the file. The other APIs are connected to the mongoose database. The APIs are used to manage ingredients and recipes. 

As the file.txt  is changed the VectorStore is updated. 
To separate the recipes, `---\n` is used as chunk seperator.

### Ingredient Management API

- **Route:** `/api/ingredients`
  - **Method:** GET
  - **Description:** Retrieve all ingredients.
  - **Sample Response:**
    ```json
    [
      {
        "name": "Tomato",
        "quantity": 5,
        "unit": "pcs"
      },
      {
        "name": "Flour",
        "quantity": 1,
        "unit": "kg"
      }
    ]
    ```

- **Route:** `/api/ingredients`
  - **Method:** POST
  - **Description:** Add a new ingredient.
  - **Sample Payload:**
    ```json
    {
      "name": "Tomato",
      "quantity": 5,
      "unit": "pcs"
    }
    ```
  - **Sample Response:**
    ```json
    {
      "name": "Tomato",
      "quantity": 5,
      "unit": "pcs"
    }
    ```

- **Route:** `/api/ingredients/:id`
  - **Method:** PUT
  - **Description:** Update an existing ingredient.
  - **Sample Payload:**
    ```json
    {
      "name": "Tomato",
      "quantity": 10,
      "unit": "pcs"
    }
    ```
  - **Sample Response:**
    ```json
    {
      "name": "Tomato",
      "quantity": 10,
      "unit": "pcs"
    }
    ```

- **Route:** `/api/ingredients/:id`
  - **Method:** DELETE
  - **Description:** Delete an ingredient.
  - **Sample Response:**
    ```json
    {
      "message": "Ingredient deleted"
    }
    ```

### Recipe Retrieval API

- **Route:** `/api/recipes`
  - **Method:** GET
  - **Description:** Retrieve a recipe or igredient status based on a query.
  - **Query Parameter:** `q` (The search query)
  - **Sample Response:**
    ```json
    {
      "recipe": "Recipe details based on the query"
    }
    ```

- **Route:** `/api/recipes`
  - **Method:** PUT
  - **Description:** Add a new recipe.
  - **Sample Payload:**
    ```json
    {
      "name": "Chocolate Cake",
      "description": "A delicious chocolate cake",
      "procedure": "Mix ingredients and bake",
      "ingredients": ["Flour", "Sugar", "Cocoa Powder"],
      "taste": "Sweet",
      "reviews": "5 stars",
      "cuisine type": "Dessert",
      "preparation time": "1 hour",
      "images": [
        {
          "caption": "Finished cake",
          "base64": "base64encodedstring"
        }
      ]
    }
    ```
  - **Sample Response:**
    ```json
    {
      "message": "Recipe added successfully"
    }
    ```