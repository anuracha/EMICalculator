# 📊 Smart EMI Calculator

A feature-rich, interactive EMI (Equated Monthly Installment) calculator designed to handle real-world loan scenarios. Unlike basic calculators, this "Smart" engine supports mid-term **prepayments** and **interest rate changes**, recalculating the amortization schedule on-the-fly.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java Version](https://img.shields.io/badge/Java-8-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-1.2.3-green.svg)

---

## ✨ Key Features

- **Dynamic Financial Engine**: Recalculates complex schedules with mid-cycle prepayments and interest rate fluctuations.
- **Interactive UI/UX**: Modern dark-themed corporate dashboard with real-time range sliders.
- **Visual Analytics**: Interactive donut charts (via Chart.js) showing the Principal vs. Interest breakdown.
- **Full Amortization Table**: Detailed row-by-row breakdown of every payment including date, EMI, interest, principal, and ending balance.
- **Export to Excel**: One-click download of the complete schedule as a CSV file optimized for spreadsheet software.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.
- **Aesthetic Date Picking**: Integrated with Flatpickr for a premium calendar experience.

---

## 🛠️ Technology Stack

- **Backend**: Java 8, Spring Boot (1.2.3.RELEASE), Maven.
- **Frontend**: Vanilla HTML5, CSS3 (Modern Flex/Grid), JavaScript (ES6+).
- **Libraries**:
  - [Chart.js](https://www.chartjs.org/) for data visualization.
  - [Flatpickr](https://flatpickr.js.org/) for modern date picking.
  - [Font Awesome](https://fontawesome.com/) for iconography.
  - [H2](https://www.h2database.com/) (In-memory database for demo purposes).

---

## 🚀 Getting Started

### Prerequisites
- JDK 8 or higher.
- Maven (a local version 3.6.3 is included in the root).

### Running Locally
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd smartemicalculator
   ```

2. **Build the project**:
   ```bash
   .\apache-maven-3.6.3\bin\mvn.cmd clean package -DskipTests
   ```

3. **Run the application**:
   ```bash
   java -jar target/smartemicalculator-1.0-SNAPSHOT.jar
   ```

4. **Access the dashboard**:
   Open `http://localhost:8080` in your browser.

---

## 🐳 Docker Support

A `Dockerfile` is included for containerized deployment.

1. **Build the image**:
   ```bash
   docker build -t smart-emi-calc .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:8080 smart-emi-calc
   ```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ for better financial planning.*
