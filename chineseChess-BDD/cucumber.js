module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/**/*.ts'],
    format: [
      'progress-bar',
      'json:reports/cucumber_report.json',
      'html:reports/cucumber_report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    tags: 'not @ignore'
  }
}; 