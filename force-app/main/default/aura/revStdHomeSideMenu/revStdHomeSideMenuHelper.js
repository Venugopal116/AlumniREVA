({
    formatLabelToFilename: function (label) {
        if (label === 'Mentor/Mentee') {
            return 'mentor-or-mentee.png';
        }
        // Replace spaces with hyphens and return the filename
        return label.replace(/\s+/g, '-').toLowerCase() + '.png';
    },


})