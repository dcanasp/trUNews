# from fastapi import FastAPI
# from transformers import pipeline
# from simplet5 import SimpleT5

""" Crear aplicacion """

# app = FastAPI()

# @app.post("/categories-generator")

def generate_Category(summarize: str) -> list:
    
    try:
        # Cargar el modelo entrenado
        cats = pipeline("text-classification", "Trained Models/Category" , tokenizer="bert-base-uncased")
        if len(summarize) > 1000:
            summarize = summarize[:1000]
        categories = cats(summarize, return_all_scores=True)
        sorted_cat = sorted(categories[0], key=lambda x: x['score'], reverse=True)
        categories = sorted_cat[:5]
        
    except:
        categories = ["Error: An exception occurred"]
    
    return categories

# @app.post("/title-generator")

def generate_Title(summarize: str) -> list:
    
    try:
        # Cargar el modelo entrenado
        title = SimpleT5()
        title.load_model("t5","Trained Models/Title", use_gpu=False)
        
        options = title.predict(summarize)
        titles = options[0].split(".")
        newsTitle = [i for i in titles if (i != "" and len(i) > 10)]
        
    except:
        newsTitle = ["Error: An exception occurred"]
    
    return newsTitle

# @app.get("/ping")

def ping():
    return "pong"


def queue(texto):
    print(texto)
    # generate_Title(texto)
    # generate_Category(texto)
    return {"err": True,"titulos": ['best existing title', 'second best title', 'third'],"categorias": [
              {"label": "EDUCATION", "score": 0.34894150495529175 },
              {"label": "BUSINESS", "score": 0.3029727041721344},
              {"label": "POLITICS", "score": 0.08930222690105438}
            ]
          }


import pika

credentials = pika.PlainCredentials(username='trunews', password='password')
ip = '34.226.1.69' #debe ser la url del back, mañana lo pruebo

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host=ip,
        port=5672,
        credentials=credentials
    )
)

channel = connection.channel()

channel.queue_declare(queue='rpc_queue')

def on_request(ch, method, props, body):
    # n = int(body)
    print(f" [.] llego")
    response = queue(body)

    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = \
                                                         props.correlation_id),
                     body=str(response))
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='rpc_queue', on_message_callback=on_request)

print(" [x] Awaiting RPC requests")
channel.start_consuming()