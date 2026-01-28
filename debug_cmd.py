import os

print("Running python setup script...")
try:
    os.mkdir("test_py_dir")
    print("Created test_py_dir")
except Exception as e:
    print(f"Error creating dir: {e}")
