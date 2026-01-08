import inquirer from 'inquirer';

async function askSelections() {
  const select1 = await inquirer.prompt([
    {
      type: 'list',
      name: 'option1',
      message: 'Select option 1:',
      choices: ['Option 1A', 'Option 1B', 'Option 1C'],
    }
  ]);

  const select2 = await inquirer.prompt([
    {
      type: 'list',
      name: 'option2',
      message: 'Select option 2:',
      choices: ['Option 2A', 'Option 2B', 'Option 2C'],
    }
  ]);

}

askSelections();
