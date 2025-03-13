const corsOptions = {
  origin: 'https://vs-shopito.vercel.app' || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, 
};

export default corsOptions;
