import logo from "./logo.svg";
import "./App.css";
import Table from "./Table";

const columns = [{ dataIndex: "a", title: "a" }, { dataIndex: "b", title: "b" }];

const App = () => {
    return (
        <div className="App">
            <Table columns={columns} />
        </div>
    );
};

export default App;
