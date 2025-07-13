import * as reporter from 'cucumber-html-reporter';
import * as path from 'path';

const options: reporter.Options = {
  theme: 'bootstrap',
  jsonFile: path.resolve(__dirname, 'reports/cucumber_report.json'),
  output: path.resolve(__dirname, 'reports/cucumber_report.html'),
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "Development",
    "Browser": "N/A",
    "Platform": process.platform,
    "Executed": "Local"
  }
};

reporter.generate(options);
