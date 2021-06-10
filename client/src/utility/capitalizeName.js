const capitalizeName = (name) => {

    const nameArray = name.split(' ');
    for (let i = 0; i < nameArray.length; i++) {
        let word = nameArray[i];
        word = word.charAt(0).toUpperCase() + word.slice(1);
        nameArray[i] = word;
    }

    return nameArray.join(' ');
}

export default capitalizeName;