module.exports = {
    navigateFallback: '/index.html',
    stripPrefix: 'dist',
    root: 'dist/',
    staticFileGlobs: [
      'dist/index.html',
      'dist/**.css',
      'dist/**.js',
      'dist/assets/images/flagBR.png',
      'dist/assets/images/flagUS.png',
      'dist/assets/css/**.css',
      'dist/assets/fonts/**.**',
      'dist/assets/js/**.js'      
    ]
  };