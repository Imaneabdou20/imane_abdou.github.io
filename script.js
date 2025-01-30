function showContent(sectionId) {
    // Cacher tous les contenus
    let contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none');

    // Afficher la section sélectionnée
    document.getElementById(sectionId).style.display = 'block';
}