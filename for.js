const letter = ['a', 'b', 'c', 'd']

for(let i = 0; i < letter.length; i++){
    console.log(letter[i]);
}
letter.forEach(f => console.log(f));
for(const f of letter){
    console.log(f)
}