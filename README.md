# LoadKaar: 
### LoadKaar: Free Roam-Load Employment

### Motivation Behind
1. In urban areas like Delhi, the population of cycle rickshaw pullers can number in the hundreds of thousands, with approximately 100,000 to 150,000 rickshaw pullers in the capital alone. Nationwide, the figure could be several million, especially when considering the large numbers of both manual and electric rickshaws in smaller towns and rural regions. Rickshaw pullers typically face economic insecurity, with daily incomes that fluctuate based on location, season, and demand. Many work under informal arrangements, renting their rickshaws and often lacking access to social security benefits, making their livelihoods precarious. This workforce plays a significant role in India’s urban and transportation landscape despite the difficulties they face.
2. India is home to over 300 million two-wheelers as of 2024, making it the largest two-wheeler market globally. The market is driven by affordability, urban mobility needs, and a preference for fuel-efficient vehicles, including a shift towards electric vehicles (EVs).
3. The area of poorly managed or inefficiently utilized warehouses and storage spaces in India is significant, primarily due to inadequate infrastructure, fragmented ownership, and outdated practices. Efforts are underway to modernize infrastructure and technology to improve storage space management and utilization.

---

## LoadKaar: Website Functionality
The LoadKaar website aims to organize and utilize unorganized labor for profitable, efficient logistics and employment across India. Key features include:

- **A.** Employing available rickshaw pullers, auto drivers, two-wheeler, four-wheeler, and truck drivers.
- **B.** Providing free temp employers around the location as needed.
- **C.** Showing temporary storage warehouses for rent based on area and time.
- **D.** Tracking employees and logistics routes.
- **E.** AI suggestions on employer needs based on requirements.
- **F.** Data collection and analytics for employment tracking on a large scale.

### Frameworks to Achieve Functionalities

#### 1. Backend
- **Data Storage**: MySQL database.
- **Frameworks**:
  - **Node.js with Express.js**: For real-time updates.
  - **Django (Python)**: For data management and high security.
  - **Ruby on Rails**: Rapid development and tracking.
  - **Spring Boot (Java)**: For scalability and handling large traffic.

#### 2. Frontend
- **Frameworks**:
  - **React.js**: Dynamic single-page application.
  - **Vue.js**: Lightweight, progressive framework.
  - **Angular**: Comprehensive framework with two-way data binding.
  - **Svelte**: Lightweight for real-time booking systems.

#### 3. Deployment & Maintenance
- **Frameworks**:
  - **Docker**: For containerization.
  - **Kubernetes**: For managing multiple containers and microservices.
  - **AWS**: For hosting and managing databases.
  - **Heroku**: For MVPs and small-scale projects.
  - **Firebase**: For real-time databases.
  - **Netlify**: For hosting static sites.

---

### Additional Tools & Libraries
- **Payment Integration**: Stripe or PayPal.
- **Geolocation & Mapping**: Google Maps API or Leaflet.
- **Real-time Data**: Socket.io or Pusher.
- **Search & Filter**: Elasticsearch.

---

## Relational Schemas for LoadKaar

### 1. Users Schema (Employees, Employers, Admins)
- **users**
  - `user_id` (Primary Key)
  - `name`, `email`, `phone_number`, `role` (employee, employer, admin), `password_hash`, `address`, `rating`
- **employee_details**
  - `employee_id` (Foreign Key referencing `users.user_id`)
  - `vehicle_type`, `availability_status`, `location`, `current_job_id` (Foreign Key), `hours_worked`, `average_rating`
- **employer_details**
  - `employer_id` (Foreign Key referencing `users.user_id`)
  - `business_name`, `address`, `company_type`, `rating`

### 2. Warehouse & Temporary Storage Schema
- **warehouses**
  - `warehouse_id` (Primary Key)
  - `address`, `location`, `available_capacity`, `price_per_hour`, `price_per_day`, `price_per_month`, `is_available`
- **warehouse_rentals**
  - `rental_id` (Primary Key)
  - `warehouse_id` (Foreign Key), `employer_id` (Foreign Key), `rental_start`, `rental_end`, `rental_price`

### 3. Job (Logistics & Employment) Schema
- **jobs**
  - `job_id` (Primary Key)
  - `employer_id` (Foreign Key), `job_type`, `pickup_location`, `dropoff_location`, `status`, `start_time`, `end_time`, `employee_id` (Foreign Key)
- **job_requirements**
  - `job_id` (Foreign Key), `required_vehicle_type`, `required_employees_count`, `required_skills`, `job_description`
- **job_assignments**
  - `job_assignment_id` (Primary Key)
  - `job_id` (Foreign Key), `employee_id` (Foreign Key), `assigned_at`, `status`

### 4. Tracking & Logistics Route Schema
- **vehicle_tracking**
  - `tracking_id` (Primary Key)
  - `employee_id` (Foreign Key), `location`, `timestamp`, `status`
- **routes**
  - `route_id` (Primary Key)
  - `job_id` (Foreign Key), `start_location`, `end_location`, `route_data`, `distance_travelled`, `estimated_time`

### 5. Analytics & AI Suggestions Schema
- **employee_performance**
  - `employee_id` (Foreign Key), `total_jobs_completed`, `average_rating`, `hours_worked`, `vehicle_type_performance`, `revenue_generated`
- **job_performance**
  - `job_id` (Foreign Key), `total_duration`, `job_type`, `employee_count`, `revenue_earned`, `satisfaction_rating`
- **ai_suggestions**
  - `suggestion_id` (Primary Key), `job_id` (Foreign Key), `suggested_vehicle_type`, `suggested_employee_count`, `estimated_cost`, `ai_model_version`, `suggestion_date`

### 6. Payments Schema
- **payments**
  - `payment_id` (Primary Key)
  - `payer_id` (Foreign Key), `receiver_id` (Foreign Key), `amount`, `payment_method`, `payment_status`, `payment_date`, `job_id` (Foreign Key), `rental_id` (Foreign Key)

### 7. Ratings & Reviews Schema
- **reviews**
  - `review_id` (Primary Key)
  - `job_id` (Foreign Key), `reviewer_id` (Foreign Key), `reviewee_id` (Foreign Key), `rating`, `comments`, `review_date`

### Key Relationships
- **One-to-many** between users and `employee_details`/`employer_details`.
- **One-to-many** between jobs and `job_requirements`.
- **Many-to-many** between jobs and employees via `job_assignments`.
- **One-to-many** between warehouses and `warehouse_rentals`.
- **One-to-many** between users and `payments`.
- **One-to-many** between jobs and routes.
- **One-to-one** between jobs and `ai_suggestions`.

# Setup Instructions:

## Clone the repository:

```bash
git clone https://github.com/Janakrish1/Loadkaar.git
cd Loadkaar
```

## Backend Setup (Express server):

1. Navigate to the backend directory (assuming the backend is in a separate folder, otherwise run in the root):

```bash
cd backend
```

2. Install the required dependencies:

```bash
npm install
```

3. Make sure to create a `.env` file (if you haven’t done so already) for environment variables (e.g., database credentials). A sample `.env` file might look like:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=loadkaar_db
PORT=5001
```

4. To run the backend with nodemon, you can use the following command:

```bash
npx nodemon app.js
```

## Frontend Setup (React app):

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install the required dependencies:

```bash
npm install
```

3. Ensure that any environment variables for the frontend (such as API endpoints) are configured in a `.env` file in the frontend folder. For example:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

4. To start the frontend app, run:

```bash
npm start
```

## Additional Notes

### CORS:
If the backend and frontend are running on different ports locally (e.g., backend on port 5001 and frontend on port 3000), ensure CORS (Cross-Origin Resource Sharing) is properly handled on the backend. You already have `cors` set up in the backend.

### Port Conflicts:
If any of the ports (e.g., 5001 for backend or 3000 for frontend) are in use, you may need to change the port numbers in the configuration or `.env` files.

## Example `.env` files:

### Backend (`.env`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=loadkaar_db
PORT=5001
```

### Frontend (`.env`):

```env
REACT_APP_API_URL=http://localhost:5001/api
```

By following these instructions, you should be able to set up the environment and run both the backend and frontend locally. You can add these instructions to your repository's `README.md` file for easy access.