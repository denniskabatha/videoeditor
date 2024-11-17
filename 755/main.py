import sqlite3

def create_database():
    conn = sqlite3.connect('waste_management.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bins (
        id INTEGER PRIMARY KEY,
        location TEXT NOT NULL,
        fill_level INTEGER NOT NULL
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY,
        bin_id INTEGER,
        collection_time TEXT,
        FOREIGN KEY (bin_id) REFERENCES bins(id)
    )
    ''')
    
    conn.commit()
    conn.close()

def add_bin(location, fill_level):
    conn = sqlite3.connect('waste_management.db')
    cursor = conn.cursor()
    
    cursor.execute('INSERT INTO bins (location, fill_level) VALUES (?, ?)', (location, fill_level))
    conn.commit()
    conn.close()

def update_fill_level(bin_id, fill_level):
    conn = sqlite3.connect('waste_management.db')
    cursor = conn.cursor()
    
    cursor.execute('UPDATE bins SET fill_level = ? WHERE id = ?', (fill_level, bin_id))
    conn.commit()
    conn.close()

def request_collection(bin_id):
    conn = sqlite3.connect('waste_management.db')
    cursor = conn.cursor()
    
    cursor.execute('INSERT INTO collections (bin_id, collection_time) VALUES (?, datetime("now"))', (bin_id,))
    conn.commit()
    conn.close()

def list_collections():
    conn = sqlite3.connect('waste_management.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM collections')
    collections = cursor.fetchall()
    conn.close()
    
    return collections

def main():
    while True:
        print("\nSmart Waste Management System")
        print("1. Add Bin")
        print("2. Update Fill Level")
        print("3. Request Collection")
        print("4. List Collections")
        print("5. Exit")
        
        choice = input("Choose an option: ")
        
        if choice == '1':
            location = input("Enter bin location: ")
            fill_level = int(input("Enter initial fill level: "))
            add_bin(location, fill_level)
            print("Bin added.")
        
        elif choice == '2':
            bin_id = int(input("Enter bin ID to update: "))
            fill_level = int(input("Enter new fill level: "))
            update_fill_level(bin_id, fill_level)
            print("Fill level updated.")
        
        elif choice == '3':
            bin_id = int(input("Enter bin ID to request collection: "))
            request_collection(bin_id)
            print("Collection requested.")
        
        elif choice == '4':
            collections = list_collections()
            print("\nUpcoming Collections:")
            for collection in collections:
                print(f"Collection ID: {collection[0]}, Bin ID: {collection[1]}, Collection Time: {collection[2]}")
        
        elif choice == '5':
            break
        
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    create_database()  # Ensure database exists before starting
    main()
