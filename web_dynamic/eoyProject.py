#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template, url_for
from models import storage
import uuid
import os

# flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
# port = 5000
# host = '0.0.0.0'
port = os.getenv("HBNB_MYSQL_PORT", "5000")
host = os.getenv("HBNB_MYSQL_HOST", "0.0.0.0")

# begin flask page rendering
@app.teardown_appcontext
def teardown_db(exception):
    """
    after each request, this method calls .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()


@app.route('/eoyProject/')
def hbnb_filters(the_id=None):
    """
    handles request to custom template with states, cities & amentities
    """
    state_objs = storage.all('State').values()
    states = dict([state.name, state] for state in state_objs)
    print(states)
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = dict([user.id, "{} {}".format(user.first_name, user.last_name)]
                 for user in storage.all('User').values())
    print(places)
    return render_template('eoyProject.html',
                           states=states,
                           amens=amens,
                           places=places,
                           users=users,
                           cache_id=uuid.uuid4())

@app.route('/detailpage/<places_id>')
def detail_page(places_id=None):
    """
    detail page for each listing
    """
    place_obj = storage.get('Place', places_id)
    if place_obj is None:
        abort(404, 'Not found')

    return render_template('detail-page.html',
                           place=place_obj,
                           cache_id=uuid.uuid4())

if __name__ == "__main__":
    """
    MAIN Flask App"""
    app.run(host=host, port=port)
