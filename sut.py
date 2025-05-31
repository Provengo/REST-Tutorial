from flask import Flask, request, jsonify

# Create Flask app
app = Flask(__name__)

# In-memory data store (replace with a database in a real application)
users = []
loans = []
holds = []
books = {}

# A route for resetting the database
@app.route('/reset', methods=['POST'])
def reset_database():
    global users, loans, holds, books
    
    # Clear all data
    users = []
    loans = []
    holds = []
    books = []
    
    # If initial data is provided, load it
    if request.is_json:
        data = request.get_json()
        if 'users' in data:
            users.extend(data['users'])
        if 'loans' in data:
            loans.extend(data['loans'])
        if 'holds' in data:
            holds.extend(data['holds'])
        if 'books' in data:
            books.extend(data['books'])
    
    return jsonify({
        'message': 'Database reset',
        'status': {
            'users': len(users),
            'loans': len(loans),
            'holds': len(holds),
            'books': len(books)
        }
    }), 200

# --- User Routes ---
@app.route('/users', methods=['POST'])
def add_user():
    user = request.get_json()

    if 'id' not in user:
        print("Error: Attempt to add user without id")
        return jsonify({'error': 'user id is required'}), 400
    if  user.get('id') in [u.get('id') for u in users]:
        print("Error: Attempt to add duplicate user")
        return jsonify({'error': 'User already exists'}), 400
    else:
      users.append(user)
      return jsonify({'message': 'User Added', 'user': user}), 201

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    global users
    users = [user for user in users if user.get('id') != user_id]
    return jsonify({'message': 'User deleted'}), 200

@app.route('/users', methods=['GET'])
def search_users():
    query = request.args.get('q', '').lower()
    results = [user for user in users if query in str(user).lower()] if query else users
    return jsonify(results)

# --- Loan Routes ---
@app.route('/loans', methods=['POST'])
def add_loan():
    loan = request.get_json()
    user_id = loan.get('userId')
    book_id = loan.get('bookId')

    # Check that user exists
    if user_id is None:
        return jsonify({'error': 'userId is required'}), 400
    if not any(u.get('id') == user_id for u in users):
        return jsonify({'error': f'User {user_id} does not exist'}), 400

    # Check that book exists
    if book_id is None:
        return jsonify({'error': 'bookId is required'}), 400

    print(f"Checking if book {book_id} exists in books: {books}")
    
    if not any(b.get('id') == book_id for b in books):
        return jsonify({'error': f'Book {book_id} does not exist'}), 400

    # Check for duplicate loan (same userId and bookId)
    if any(l.get('userId') == user_id and l.get('bookId') == book_id for l in loans):
        return jsonify({'error': 'Loan already exists'}), 400

    loans.append({'userId': user_id, 'bookId': book_id})
    return jsonify({'message': 'Loan added', 'loan': {'userId': user_id, 'bookId': book_id}}), 201

@app.route('/loans', methods=['DELETE'])
def delete_loan():
    data = request.get_json()
    user_id = data.get('userId')
    book_id = data.get('bookId')
    
    if user_id is None:
        return jsonify({'error': 'userId is required'}), 400
    if book_id is None:
        return jsonify({'error': 'bookId is required'}), 400
    
    global loans
    before_count = len(loans)
    loans = [loan for loan in loans if not (loan.get('userId') == user_id and loan.get('bookId') == book_id)]
    after_count = len(loans)
    if before_count == after_count:
        return jsonify({'error': 'Loan not found'}), 404
    return jsonify({'message': 'Loan deleted'}), 200

@app.route('/loans', methods=['GET'])
def search_loans():
    user_id = request.args.get('userId')
    book_id = request.args.get('bookId')
    results = loans
    if user_id:
        results = [loan for loan in results if str(loan.get('userId')) == str(user_id)]
    if book_id:
        results = [loan for loan in results if str(loan.get('bookId')) == str(book_id)]
    return jsonify(results)

# --- Hold Routes ---
@app.route('/holds', methods=['POST'])
def add_hold():
    hold = request.get_json()
    holds.append(hold)
    return jsonify({'message': 'Hold added', 'hold': hold}), 201

@app.route('/holds/<int:hold_id>', methods=['DELETE'])
def delete_hold(hold_id):
    global holds
    holds = [hold for hold in holds if hold.get('id') != hold_id]
    return jsonify({'message': 'Hold deleted'}), 200

@app.route('/holds', methods=['GET'])
def search_holds():
    query = request.args.get('q', '').lower()
    results = [hold for hold in holds if query in str(hold).lower()] if query else holds
    return jsonify(results)

# --- Book Routes ---
@app.route('/books', methods=['POST'])
def add_book():
    book = request.get_json()

    if 'id' not in book:
        print("Error: Attempt to add book without id")
        return jsonify({'error': 'book id is required'}), 400
    if book.get('id') in books:
        print("Error: Attempt to add duplicate book")
        return jsonify({'error': 'Book already exists'}), 400
    else:
        books.append(book)
        return jsonify({'message': 'Book Added', 'book': book}), 201

@app.route('/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = next((b for b in books if b.get('id') == book_id), None)
    if book:
        books.remove(book)
        return jsonify({'message': 'Book deleted'}), 200
    return jsonify({'error': 'Book not found'}), 404

@app.route('/books', methods=['GET'])
def search_books():
    query = request.args.get('q', '').lower()
    results = [book for book in books if query in str(book).lower()] if query else books
    return jsonify(results)

@app.route('/books/<book_id>', methods=['GET'])
def get_book(book_id):
    book = next((b for b in books if b.get('id') == book_id), None)
    if book:
        return jsonify(book), 200
    return jsonify({'error': 'Book not found'}), 404

if __name__ == '__main__':
    import socket
    import random

    host = "localhost" #socket.gethostbyname(socket.gethostname())
    print(f"{host=}")

    port = 23242 #random.randint(1024, 65535)
    print(f"{port=}")
    
    app.run(host=host, port=port, debug=True)
