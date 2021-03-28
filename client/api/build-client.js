import axios from 'axios';

const BuildClient = ({req}) => {
    if (typeof window === 'undefined') {
        //we are on the server
        //http://<servicename>.<namespace>.svc.cluster.local
        
        return axios.create({
            baseURL: 'http://www.d99-ticketing-app.xyz/',
            headers: req.headers
        });
    }
    else {
        //we are on the browser
        return axios.create({
            baseURL: '/'
        });
    }
};

export default BuildClient;