export const getRandomColor = () => {
  const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey'];

  return colors[Math.floor(Math.random() * Math.floor(colors.length))];
}

export const iconTypes = iconType => {
  const icons = {
    TRENDING: 'line graph',
    USER_SEARCH: 'search',
    FAVORITES: 'heart outline'
  }
  return icons[iconType];
}