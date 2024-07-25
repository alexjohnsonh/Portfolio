document.addEventListener('DOMContentLoaded', function() {
    const projects = document.querySelectorAll('.project');
    
    projects.forEach(project => {
      const btn = project.querySelector('.btn-box');
      const overlay = project.querySelector('.overlay');
      const closeBtn = overlay.querySelector('.overlay-inner');
  
      btn.addEventListener('click', () => {
        overlay.style.display = 'flex';
      });
  
      closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
      });
    });
  });