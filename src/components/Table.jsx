import Table from "react-bootstrap/Table";
import data from "../mock_stores.json";
import { useState } from "react";
function Tables() {
  const [computedValues, setComputedValues] = useState([]);
  const [inputValue, setInputValue] = useState(0);

  const getAllValues = (id) => {
    let store = data.find((item) => item.months.find((e) => e.id === id));
    let eachMon = store.months.find((e) => e.id === id);
    if (inputValue < 0 || inputValue === 0) {
      eachMon.value = 0;
    }
    if (inputValue > 0) {
      eachMon.value = inputValue;
    }

    let finalArr = data.map((item) => {
      return item.months.map((e) => {
        if (eachMon.id === e.id) {
          return { ...e, value: eachMon.value, storeName: item.store.name };
        } else {
          return { ...e, storeName: item.store.name };
        }
      });
    });
    setComputedValues(
      finalArr.map((subArr) =>
        subArr.map((item) => ({
          value: +item.value,
          name: item.storeName,
          monthName: item.name,
        }))
      )
    );
    setInputValue("");
  };

  const handleInput = (num) => {
    if (typeof +num.target.value === "number") {
      setInputValue(+num.target.value);
    }
    return 0;
  };

  let computedSumEachMonth = computedValues.map((value) =>
    value.reduce((acc, rec) => acc + rec.value, 0)
  );

  const monthsNames = data
    .slice(0, 1)
    .map((e) =>
      e.months.slice(0, 12).map((month) => <th key={month.id}>{month.name}</th>)
    );

  let mainMonObj = [];
  computedValues.map((val) =>
    val.map((obj) => mainMonObj.push({ name: obj.monthName, value: obj.value }))
  );

  const eachMonValues = Object.values(
    mainMonObj.reduce(
      (acc, n) => (
        // eslint-disable-next-line
        ((acc[n.name] ??= { ...n, value: 0 }).value += n.value), acc
      ),
      {}
    )
  );

  const totalOfTotals = eachMonValues
    ? eachMonValues.map((e) => e.value).reduce((acc, rec) => acc + rec, 0) +
      computedSumEachMonth.reduce((acc, rec) => acc + rec, 0)
    : 0;
  return (
    <>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Store name</th>
            {monthsNames}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index, array) => (
            <tr key={item.store.id}>
              <td>{item.store.name}</td>
              {item.months.map((mon) => (
                <td key={mon.id}>
                  <input
                    type="number"
                    className="form-control w-100"
                    onChange={(e) => handleInput(e)}
                    onKeyUp={() => getAllValues(mon.id)}
                  />
                </td>
              ))}
              <td className="store-totals">
                {computedSumEachMonth.length > 0 &&
                array[index].store.name === computedValues[index][0].name
                  ? computedSumEachMonth[index]
                  : 0}
              </td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            {eachMonValues.length > 0 ? (
              eachMonValues.map((val) => (
                <td className="store-totals" key={val.name}>
                  {val.value}
                </td>
              ))
            ) : (
              <td>{0}</td>
            )}
            <td>{totalOfTotals ? totalOfTotals : 0}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default Tables;
