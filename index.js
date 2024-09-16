const express = require('express');
const bodyParser = require('body-parser'); 
const app = express();

app.use(bodyParser.json());

// Array para armazenar os carros cadastrados
let listaCarros = [];

// Rota para cadastrar um novo carro
// Utilize Body Parameters para receber os dados do carro
 app.post('/carros', (req, res) => { 
    // Implemente a lógica para receber e salvar os dados do carro na lista
    // Dados esperados: marca, modelo, placa, valor e cor
    // Exemplo de JSON de requisição: { "marca": "Toyota", "modelo": "Corolla", "placa": "ABC1234", "valor": 50000, "cor": "prata" }
    const novoCarro = req.body;
    
    //Validação para verificar se todos os campos estão preenchidos.
    if(!novoCarro.marca || !novoCarro.modelo || !novoCarro.placa || !novoCarro.valor || !novoCarro.cor){
        return res.status(400).json({ message: "Todos os campos devem ser preenchidos corretamente."});
    }
    //Validação para verificar se o campo VALOR está preenchido corretamente.
    if(typeof novoCarro.valor!== 'number' || novoCarro.valor < 0 ){
        return res.status(400).json({ message: "O valor do veículo não pode ser negativo ou diferente do tipo number."});
    }
    //Validação para verificar se o carro já existe na lista. 
    const carroExiste = listaCarros.find(carro => carro.placa === novoCarro.placa); 
    if(carroExiste){
        return res.status(409).json({ message : "O carro já existe na lista."});
    }

    novoCarro.id = listaCarros.length+1; 
    listaCarros.push(novoCarro);
    res.status(201).json({ message: 'Carro cadastrado com sucesso!', carro: novoCarro });  
    

}); 


// Rota para obter um carro pelo ID
// Utilize Path Parameters para receber o ID do carro na rota
app.get('/carros/:id', (req, res) => {
    // Implemente a lógica para buscar e retornar o carro pelo ID
    // Utilize o Path Parameter 'id' para identificar o carro desejado
    const idCarro = parseInt(req.params.id);
    const carroEncontrado = listaCarros.find(carro => carro.id === idCarro);
    if (!carroEncontrado) {
        res.status(404).json({ message: 'Carro não encontrado' });
    } else {
        res.json(carroEncontrado);
    }
});

// Rota para listar todos os carros
// Utilize Query Parameters para receber parâmetros opcionais de filtragem
app.get('/carros', (req, res) => {
    // Implemente a lógica para listar os carros, podendo filtrar opcionalmente por marca, modelo ou cor
    // Utilize os Query Parameters 'marca', 'modelo' e 'cor' para filtragem, se fornecidos
    let carrosFiltrados = listaCarros;
    const {marca, modelo, cor} = req.query; 
    if (marca) {
        carrosFiltrados = carrosFiltrados.filter(carro => carro.marca === marca);
    }
     if (modelo) {
        carrosFiltrados = carrosFiltrados.filter(carro => carro.modelo === modelo);
    }
    if (cor) {
        carrosFiltrados = carrosFiltrados.filter(carro => carro.cor === cor);
    }
    res.json(carrosFiltrados); 
});


// Rota para atualizar os dados de um carro pelo ID
// Utilize Path Parameters para receber o ID do carro na rota
// Utilize Body Parameters para receber os novos dados do carro
app.put('/carros/:id', (req, res) => {
    // Implemente a lógica para atualizar os dados do carro pelo ID fornecido
    // Utilize os Path Parameter 'id' para identificar o carro a ser atualizado
    // Utilize os Body Parameters para receber os novos dados do carro a serem atualizados
    const carroId = parseInt(req.params.id);
    const dadosAtualizados = req.body;

    const index = listaCarros.findIndex(carro => carro.id === carroId);
    if (index === -1) {
        res.status(404).json({ message: 'Carro não encontrado' });
    } else {
        listaCarros[index] = { ...listaCarros[index], ...dadosAtualizados };
        res.json({ message: 'Dados do carro atualizados com sucesso!', carro: listaCarros[index]});
    }
});

// Rota para deletar um carro pelo ID
// Utilize Path Parameters para receber o ID do carro na rota
app.delete('/carros/:id', (req, res) => {
    // Implemente a lógica para deletar o carro pelo ID fornecido
    // Utilize o Path Parameter 'id' para identificar o carro a ser deletado
    const carroId = parseInt(req.params.id);
    listaCarros = listaCarros.filter(carro => carro.id !== carroId);
    res.json({ message: 'Carro deletado com sucesso!' });
});
 
// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
