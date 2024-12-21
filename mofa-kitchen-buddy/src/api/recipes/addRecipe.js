import fs from 'fs';
import path from 'path';
import config from '../../config';

function addRecipetoFile(data) {
    /*
    expected data
    {
    name,
    description,
    procedure
    ingredients,
    taste,
    reviews, 
    cuisine type,
    preparation time
    {images base64 with caption}
    }
    
    */
   
    const separator = '---\n';
    let markdown = separator;
    markdown += `# ${data.name}\n\n`;
    markdown += `**Description:** ${data.description}\n\n`;
    markdown += `**Procedure:**\n${data.procedure}\n\n`;
    markdown += `**Ingredients:**\n${data.ingredients.join('\n')}\n\n`;
    markdown += `**Taste:** ${data.taste}\n\n`;
    markdown += `**Reviews:** ${data.reviews}\n\n`;
    markdown += `**Cuisine Type:** ${data['cuisine type']}\n\n`;
    markdown += `**Preparation Time:** ${data['preparation time']}\n\n`;
    markdown += `**Images:**\n`;
    data.images.forEach(image => {
        markdown += `![${image.caption}](data:image/jpeg;base64,${image.base64})\n`;
    });
    const recipeFilePath = path.join(config.recipeFile);

    fs.appendFile(recipeFilePath, markdown, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Recipe added successfully');
        }
    });
}
