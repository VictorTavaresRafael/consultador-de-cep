import axios from "axios";

var Api = axios.create({
    baseURL:'https://viacep.com.br/ws/'
});
export default Api;