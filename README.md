# Welcome to WallStreet AI

## Project info

**Use your preferred IDE**

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

# For the Python Server :

```sh
# 1. Create a virual environment :
conda create -n env_name

# 2. Activate the virtual environment :
conda activate env_name

# 3. Install the dependencies :
Run the following code in the root directory of the project :
pip install -r requirements.txt

# 4. Run the following code to start up the application :
streamlit run --server.fileWatcherType none app.py

Here, I had to turn off the filewatcher to fix a build issue due to incompatibility with either of streamlit or pytorch versions.

I have uncommented the following in app.py for now, to disable the filewatcher :

```{python}
os.environ["STREAMLIT_SERVER_ENABLE_FILE_WATCHER"] = "false"
```

So, we can directly run using :
streamlit run app.py

However, if it is commented, we will have to use the 1st command with fileWatcherType none.
