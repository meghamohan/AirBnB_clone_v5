from sqlalchemy import create_engine, MetaData
import os

def main():
    con = create_engine(
        'mysql+mysqldb://{}:{}@{}/{}'.format(
            os.environ.get('HBNB_MYSQL_USER'),
            os.environ.get('HBNB_MYSQL_PWD'),
            os.environ.get('HBNB_MYSQL_HOST'),
            os.environ.get('HBNB_MYSQL_DB')))

    print(con)



if __name__ == "__main__":
    main()
