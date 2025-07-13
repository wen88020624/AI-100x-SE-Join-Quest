module.exports = {
  default: {
    require: [
      'ts-node/register',
      'src/test/steps/**/*.ts'
    ],
    requireModule: [
      'ts-node/register'
    ],
    format: ['progress-bar', 'json:reports/cucumber_report.json'],
    paths: ['src/test/features/*.feature'],
    publishQuiet: true
  }
}; 