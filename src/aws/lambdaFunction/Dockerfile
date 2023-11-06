FROM public.ecr.aws/lambda/nodejs:18 as builder
WORKDIR /usr/app

# Copy entire project directory.
COPY . .

# Install dependencies including Prisma CLI if it's not already included
RUN npm i --include=dev
# Generate Prisma client, assuming you have a script in package.json for it

# Build the project
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy the build artifacts from the builder stage.
COPY --from=builder /usr/app/dist/* ./
COPY --from=builder /usr/app/package.json ./
COPY --from=builder /usr/app/package-lock.json ./
# COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/.env ./
COPY --from=builder /usr/app/prisma ./prisma
RUN npm ci --production
RUN npx prisma generate

# Set the command to be run when the Docker container starts.
CMD ["lambdaPoblate.main"]