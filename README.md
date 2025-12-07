# 🎨 Color Picker App

A modern, beautiful color picker application built with React, TypeScript, and Tailwind CSS v4. Features a stunning glassmorphism design with advanced color selection tools.

![Color Picker App](https://via.placeholder.com/800x400/667eea/ffffff?text=Color+Picker+Demo)

## ✨ Features

- **Glassmorphism UI**: Sleek, modern design with translucent elements and blur effects
- **RGB Sliders**: Precise color control with real-time RGB value adjustment
- **Color Palette**: Predefined color options with descriptive names
- **Recent Colors**: Automatically saves and displays recently used colors
- **Color Information**: Displays hex and RGB values for selected colors
- **Copy to Clipboard**: One-click copying of hex color codes
- **Responsive Design**: Works beautifully on all device sizes
- **TypeScript**: Fully typed for better development experience

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Icons**: Custom SVG components
- **Deployment**: Ready for modern hosting platforms

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/HamedSadim1/labo3-kleurkiezer.git
   cd labo3-kleurkiezer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎯 Usage

### Basic Color Selection

1. Use the **RGB Picker** button to reveal sliders for Red, Green, and Blue values
2. Adjust the sliders to create your desired color
3. The color display updates in real-time

### Palette Selection

1. Choose from the **Color Palette** dropdown
2. Select from predefined colors with descriptive names

### Additional Features

- **Copy Hex**: Click the "Copy Hex" button to copy the color code to clipboard
- **Recent Colors**: Click on previously used colors for quick selection
- **Color Info**: View both hex and RGB representations

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🏗️ Project Structure

```text
src/
├── components/
│   ├── AppLayout.tsx
│   ├── ColorPicker.tsx
│   ├── ColorInput.tsx
│   ├── ColorSelect.tsx
│   └── ColorDisplay.tsx
├── constants/
│   └── colors.ts
├── utils/
│   └── colorUtils.ts
├── svg/
│   └── ColorIcon.svg
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Design Philosophy

This app embraces modern web design principles:

- **Glassmorphism**: Translucent elements with backdrop blur for depth
- **Minimalism**: Clean, uncluttered interface focused on functionality
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Performance**: Optimized with Vite for fast loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hamed Sadim** - [GitHub](https://github.com/HamedSadim1)

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
