import fs from "fs";
import path from "path";
import { Ollama } from "langchain/llms/ollama";
import { HuggingFaceInference } from "langchain/embeddings/huggingface";
import Ingredient from "./models/ingredient"; // Assuming the schema is saved in a models folder

// Define the LLMs and Embeddings
const ollama = new Ollama();
const hfEmbedding = new HuggingFaceInference({
  model: "sentence-transformers/all-MiniLM-L6-v2", // Replace with your desired Hugging Face model
});

const recipeFilePath = path.join(__dirname, "recipes.txt");
let recipesData = [];
let recipeEmbeddings = [];

// Load recipes into memory
async function loadRecipes() {
  const data = await readRecipeFile(recipeFilePath);
  recipesData = data.split("---\n");

  // Generate embeddings for the recipes
  recipeEmbeddings = await Promise.all(
    recipesData.map(async (recipe) => ({
      recipe,
      embedding: await hfEmbedding.embedText(recipe),
    }))
  );
}

async function readRecipeFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function queryRecipe(question) {
  // Generate an embedding for the question
  const questionEmbedding = await hfEmbedding.embedText(question);

  // Find the most relevant recipe (e.g., cosine similarity)
  let mostRelevantRecipe = null;
  let highestSimilarity = -Infinity;

  for (const { recipe, embedding } of recipeEmbeddings) {
    const similarity = cosineSimilarity(questionEmbedding, embedding);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostRelevantRecipe = recipe;
    }
  }

  return mostRelevantRecipe || "No relevant recipe found.";
}

async function queryIngredientAvailability(ingredientName) {
  try {
    const ingredient = await Ingredient.findOne({ name: ingredientName });
    if (ingredient) {
      return `${ingredientName} is available. Type: ${ingredient.type}, Quantity: ${ingredient.quantity}`;
    } else {
      return `${ingredientName} is not available.`;
    }
  } catch (err) {
    console.error("Error querying ingredient:", err);
    return "An error occurred while checking ingredient availability.";
  }
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function reloadRecipes() {
  try {
    console.log("Reloading recipes...");
    await loadRecipes();
    console.log("Recipes reloaded successfully.");
  } catch (error) {
    console.error("Error reloading recipes:", error);
  }
}

fs.watch(recipeFilePath, async (eventType, filename) => {
  if (eventType === "change") {
    console.log(`${filename} file changed.`);
    await reloadRecipes();
  }
});

// New functions for suggesting recipes and telling procedures
async function suggestRecipes() {
  return recipesData.map(recipe => ({ recipe }));
}

async function tellProcedure(recipeName) {
  const recipe = recipesData.find(r => r.includes(recipeName));
  if (recipe) {
    return recipe;
  } else {
    return "Recipe not found.";
  }
}

// System prompt and agent to detect question type
async function handleQuestion(question) {
const systemPrompt = "You are a helpful assistant for Mofa's Kitchen Buddy. You can suggest recipes, find recipes, tell procedures, and check if ingredients are available. Respond in JSON format with images stored as base64.";
const question = question.trim().toLowerCase();
const questionTypes = [
    "suggest recipes",
    "find recipe",
    "tell procedure",
    "check ingredient"
];

const llmResponse = await ollama.call({
    prompt: `${systemPrompt}\nQuestion: ${question}\nTypes: ${JSON.stringify(questionTypes)}\n Return the question type as JSON.`
});

const { questionType } = JSON.parse(llmResponse.text);

if (questionType === "suggest recipes") {
    const recipes = await suggestRecipes();
    return { type: "suggestion", data: recipes };
} else if (questionType === "find recipe") {
    const recipe = await queryRecipe(question);
    return { type: "recipe", data: recipe };
} else if (questionType === "tell procedure") {
    const recipeName = question.split("procedure for ")[1];
    const procedure = await tellProcedure(recipeName);
    return { type: "procedure", data: procedure };
} else if (questionType === "check ingredient") {
    const ingredientName = question.split("check ingredient ")[1];
    const availability = await queryIngredientAvailability(ingredientName);
    return { type: "availability", data: availability };
} else {
    return { type: "unknown", data: "I don't understand the question." };
}
}

// Initial load of recipes
loadRecipes();

export default handleQuestion;