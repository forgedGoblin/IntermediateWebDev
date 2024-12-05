# Champion Mastery Tracker

Welcome to the Champion Mastery Tracker! This website allows you to track your champion mastery progress in League of Legends. Enter your Riot ID to view your top 5 mastered champions along with their mastery levels and points.

## Features

- **Champion Mastery Data**: View your top 5 mastered champions with their mastery levels and points.
- **Profile Links**: Quick links to your profile on popular League of Legends statistics websites like op.gg, League of Graphs, and u.gg.
- **Responsive Design**: The website is responsive and works well on different screen sizes.

## Technologies Used

- **HTML**: Structure of the website.
- **CSS**: Styling of the website, including responsive design.
- **JavaScript**: Fetching data from the Riot Games API and displaying it on the website.
- **Riot Games API**: Fetching champion mastery data and champion information.

## How to Use

1. Enter your Riot ID in the format `SummonerName#TAG` in the input field.
2. Click the "Get Mastery" button.
3. View your top 5 mastered champions along with their mastery levels and points.
4. Use the provided links to view your profile on op.gg, League of Graphs, and u.gg.

## File Structure

- `index.html`: The main HTML file for the website.
- `css/`: Directory containing CSS files for styling.
  - `styles.css`: Main stylesheet.
  - `fonts.css`: Font styles.
  - `variables.css`: CSS variables for colors and other reusable styles.
- `js/`: Directory containing JavaScript files.
  - `script.js`: Main JavaScript file for fetching and displaying data.
- `README.md`: This file.

## Important Notes

- **CORS Proxy Server**: The website uses `https://cors-anywhere.herokuapp.com/` as a CORS proxy server because of how the Riot Games API is set up. You need to enable the proxy server by visiting the URL and clicking on the "Request temporary access to the demo server" button.
- **API Key Reset**: The Riot Games API key resets every 24 hours. Ensure you have a valid API key from the Riot Games Developer Portal and update the `API_KEY` variable in `script.js` with your key. The website will not work without these two requirements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Riot Games API](https://developer.riotgames.com/) for providing the data.
- [op.gg](https://op.gg/), [League of Graphs](https://www.leagueofgraphs.com/), and [u.gg](https://u.gg/) for their services.
- [CORS Anywhere](https://cors-anywhere.herokuapp.com/) for providing the CORS proxy server.