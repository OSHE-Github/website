const Bricks = require('bricks.js')

// Navbar scroll effect
window.onscroll = () => {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById('navbar').className = 'toggle-background';
  } else {
    document.getElementById('navbar').className = '';
  }
}

// On page ready
document.addEventListener('DOMContentLoaded', function() {
  // Bricks
  const bricks = Bricks({
    container: '.wall',
    packed: 'data-packed',
    sizes: [
      { columns: 1, gutter: 10 },
      { mq: '700px', columns: 1, gutter: 10 },
      { mq: '900px', columns: 2, gutter: 25 },
      { mq: '1200px', columns: 3, gutter: 50 }
    ]
  });

  bricks.pack();

  document.onreadystatechange = () => {
    bricks.pack();
  }

  window.onresize = () => {
    bricks.pack();
  }

  // Credits
  document.getElementById('show-credits').addEventListener('click', event => {
    document.getElementsByTagName('body')[0].className = 'toggle-credits';
  });

  document.getElementById('credits-container').addEventListener('click', event => {
    document.getElementsByTagName('body')[0].className = '';
  });
});
