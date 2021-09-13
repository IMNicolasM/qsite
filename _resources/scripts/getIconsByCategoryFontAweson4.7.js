//Parse font aweson page and return names by catgeory
async function getIconsData() {
  iconsData = {}
  iconsContent = document.getElementById('icons')//Get icons content
  //Get icons by category
  for (const category of iconsContent.getElementsByTagName('section')) {
    categoryName = category.getElementsByTagName('h2')[0].textContent//Get category title
    iconsData[categoryName] = [] //instance category icons
    //Get icons by category
    for (const icon of category.getElementsByTagName('i'))
      iconsData[categoryName].push(icon.className)

    //Log
    console.log('Get icons from category ' + categoryName)
  }
  copy(iconsData)
  console.log('Finished Get icons copied on clipboard')
}
