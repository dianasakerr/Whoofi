
// TODO: needs to change before deployment
const img_placeholder_url = "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dog-walker-logo-design-template-f2fabdd56851e494f58fb6ebbe455cfc_screen.jpg"
// FakeData.js
const DEFAULT_IMG = img_placeholder_url;

// Function to generate a random date of birth
const getRandomDOB = () => {
  const start = new Date(1980, 0, 1); // January 1, 1980
  const end = new Date(2000, 11, 31); // December 31, 2000
  const dob = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return dob.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
};

// Function to generate a random phone number
const getRandomPhoneNumber = () => {
  const phoneNumber = '555' + Math.random().toString().slice(2, 11);
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'); // Format as (555) 555-5555
};

// Function to generate random experience (years)
const getRandomExperience = () => Math.floor(Math.random() * 5) + 1; // Random number between 1 and 10

// Function to generate random price
const getRandomPrice = () => (Math.floor(Math.random() * 50) + 20) * 10; // Random number between 200 and 700 (in tens)

// Function to generate random rating
const getRandomRating = () => parseFloat((Math.random() * 5).toFixed(1)); // Random number between 0.0 and 5.0

// List of real-sounding dog walker names
const dogWalkerNames = [
  'Sophia', 'Jackson', 'Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Lucas', 'Isabella', 'Elijah',
  'Charlotte', 'Oliver', 'Amelia', 'Mason', 'Mia', 'Ethan', 'Harper', 'Aiden', 'Evelyn', 'Logan',
  'Abigail', 'James', 'Emily', 'Alexander', 'Madison', 'Benjamin', 'Avery', 'Henry', 'Ella'
];

const fakeDogWalkers = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  name: dogWalkerNames[index % dogWalkerNames.length],
  photo: DEFAULT_IMG,
  location: 'Tel Aviv', // Default location
  dateOfBirth: getRandomDOB(),
  experience: getRandomExperience(),
  price: getRandomPrice(),
  phoneNumber: getRandomPhoneNumber(),
  rating: getRandomRating(),
}));

export default fakeDogWalkers;
