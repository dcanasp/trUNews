## TruNews
README

This document outlines the technical details of TruNews, a news outlet project designed for the "Software Engineering 2" class.

Mission: Delivering unbiased news with integrity and a seamless user experience, free from intrusive ads.

### Features:

- User-friendly interface:
    - Read articles
    - Share articles on social media and with QR codes
    - Save articles
    - Follow people and communities
    - Participate in events
- Advanced AI:
	- Automatically generate natural titles and categorize articles (models not included in this repo)
- Personalized content:
	- Discover trending articles and related communities
	- Search for specific users, articles, and communities
- Community-driven:
	- Join communities centered around diverse interests
	- Join events that center around those interests

### Technical Stack:

- Programming Language: TypeScript
- Database: PostgreSQL
- API Communication: REST
- Notable Algorithms:
	- Feed: Softmax based on categories
	- Trending Articles/Authors: Weighted algorithm with sigmoid functions
	- Related communities: Statistical deviation algorithm
	- Searches and related articles
- Queue System: RabbitMQ

##### Infrastructure
- Fully dockerized
- Unit tested with Jest
- GitHub Actions for automated server management
- Logging with Winston
- Prisma ORM
- Entry validation with ZOD
- Database population scripts
- Trending algorithm reset scripts
- Swagger documentation
- Image conversion with Sharp
- Dependency injection with Tsyringe
- Deployment:
- DockerHub hosting (all code and docker-compose)
###### AWS infrastructure
- EC2 server
- S3 for images
- CloudFront for CDN
- Lambda and EventBridge for simulating user activity and trend generation
- Nginx proxy for SSL certificate

### Contact Information:

David Alfonso Cañas | Backend Software Developer
inquiries: david.alfonso.canas@gmail.com