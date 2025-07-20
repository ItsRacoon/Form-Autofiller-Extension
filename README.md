
# 🚀 Smart Form Autofiller Chrome Extension

This Chrome Extension auto-fills placement and academic forms for students by retrieving their saved personal and academic data from Chrome's local storage. Built for ease of use, it automatically detects relevant fields and populates them when the form loads.

## 📦 Features

- Autofills fields like Name, USN, Email, Phone, DOB, Gender, Marks, CGPA, Branch, College, etc.
- Compatible with Google Forms and standard HTML forms.
- Quick setup using local storage.
- Supports stealth and ultra-stealth modes for detection avoidance (optional).

## 📂 Folder Structure

```
SmartFormAutofiller/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
└── README.md
```

## 🔧 Installation

1. Download or clone the repository.
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the `SmartFormAutofiller` folder.

## 💾 Saving Form Data

You can manually save your form data using the Chrome Developer Console:

```js
chrome.storage.local.set({
  formData: {
    name: "Your Name",
    usn: "Your USN",
    email: "your.email@example.com",
    phone: "Your Phone Number",
    dob: "YYYY-MM-DD",
    gender: "Male/Female",
    tenth: "Your 10th Percentage",
    twelfth: "Your 12th Percentage",
    cgpa: "Your CGPA",
    mcaCgpa: "Your MCA CGPA",
    college: "Your College Name",
    branch: "Your Branch",
    batch: "Your Batch Year"
  }
});
```

## 🌐 Example Supported Form

- Google Form: [Placement Form Example](https://docs.google.com/forms/d/e/1FAIpQLSeZ1D9ACG4kpsEUrdT4RFShtFyKZNSHXZVDWcNFISygbyKa1A/viewform?pli=1)

## 🐞 Troubleshooting

- Make sure all input fields have `id`, `name`, or `aria-labelledby` attributes.
- If the extension is not working, ensure the form is fully loaded and reload the page.
- Confirm you’re logged into Chrome and have the correct permissions.

## 👨‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 📄 License

This project is licensed under the MIT License.
