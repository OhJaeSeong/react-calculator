import * as React from "react";
import styled from "styled-components";

import Panel from "./Panel";
import History from "./History";
import Display from "./Display";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";

const Container = styled.div`
  margin: 30px auto;
  text-align: center;
`;

// TODO: History 내에서 수식 표시할 때 사용
//?
const Box = styled.div`
  display: inline-block;
  width: 270px;
  height: 65px;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 5px;
  text-align: right;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  cursor: pointer;
  h3 {
    margin: 0px;
  }
`;

const evalFunc = function (string) {
    // eslint-disable-next-line no-new-func
    string = string.toString().replace("×", "*");
    string = string.toString().replace("÷", "/");
    string = string.toString().replace("√", "Math.sqrt");
    return new Function("return (" + string + ")")();
};

class Calculator extends React.Component {
  // TODO: history 추가
  state = {
      displayValue: "",
      history: [],
      len : 0
  };

    onClickButton = key => {
        let { displayValue = "", len = 0, history = [] } = this.state;
    displayValue = "" + displayValue;
    const lastChar = displayValue.substr(displayValue.length - 1);
    const operatorKeys = ["÷", "×", "-", "+"];
    const proc = {
      AC: () => {
        this.setState({ displayValue: "" });
      },
      BS: () => {
        if (displayValue.length > 0) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        }
        this.setState({ displayValue });
      },
      // TODO: 제곱근 구현
      "√": () => {
         // if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          displayValue = "√(" + displayValue + ")"
          history[len] = displayValue.toString();
          this.setState({ history });
          len = len + 1;
          this.setState({ len });
          
          //history += displayValue;
              displayValue = displayValue.toString().replace("√", "");
              displayValue = "Math.sqrt" + displayValue;
              displayValue = displayValue.toString().replace("×", "*");
              displayValue = displayValue.toString().replace("÷", "/");
              displayValue = evalFunc(displayValue);
          this.setState({ displayValue });
         // }
        },
      // TODO: 사칙연산 구현
       "÷": () => {
           if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
               this.setState({ displayValue: displayValue + "÷" });
           }
        },
        "×": () => {
            if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
                this.setState({ displayValue: displayValue + "×" });
                //this.setState({ displayValue: displayValue + "*" });
            }
        },
      "-": () => {
          if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
              this.setState({ displayValue: displayValue + "-" });
          }
        },
      "+": () => {
        // + 연산 참고하여 연산 구현
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
            this.setState({ displayValue: displayValue + "+" });
        }
      },
      "=": () => {
          if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
          } else if (lastChar !== "") {
              history[len] = displayValue.toString();
              this.setState({ history });
              len = len + 1;
              this.setState({ len });
              displayValue = displayValue.toString().replace("×", "*");
              displayValue = displayValue.toString().replace("÷", "/");
              if (displayValue.includes("√")) {
                  let start = displayValue.toString().indexOf("√") + 1;
                  let end = start+1;
                  while (displayValue.substr(end, 1) !== "" && displayValue.substr(end, 1) >= '0' && displayValue.substr(end, 1) <= '9') {
                      end = end + 1;
                  }
                  if (displayValue.includes("(")) {
                      displayValue = displayValue.toString().replace("√", "");
                      displayValue = "Math.sqrt" + displayValue;
                  }
                  else if (start === 1) {
                      displayValue = "Math.sqrt(" + displayValue.substr(start, end - start) + ")" + displayValue.substr(end, displayValue.length);
                  } else {
                      displayValue = displayValue.substr(0, displayValue.toString().indexOf("√")) + "Math.sqrt("
                          + displayValue.substr(start, end - start) + ")" + displayValue.substr(end, displayValue.length);
                  }
              }
              displayValue = evalFunc(displayValue);
          }
        this.setState({ displayValue });
      },
        ".": () => {
            if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
                if (displayValue.includes(".")) {

                } else {
                    this.setState({ displayValue: displayValue + "." });
                }
            }
      },
      "0": () => {
        if (Number(displayValue) !== 0) {
          displayValue += "0";
          this.setState({ displayValue });
        }
      }
    };

    if (proc[key]) {
      proc[key]();
    } else {
      // 여긴 숫자
      this.setState({ displayValue: displayValue + key });
      }
  };

  render() {
    return (
      <Container>
        <Panel>
          <Display displayValue={this.state.displayValue} />
          <ButtonGroup onClickButton={this.onClickButton}>
            <Button size={1} color="gray">
              AC
            </Button>
            <Button size={1} color="gray">
              BS
            </Button>
            <Button size={1} color="gray">
              √
            </Button>
            <Button size={1} color="gray">
              ÷
            </Button>

            <Button size={1}>7</Button>
            <Button size={1}>8</Button>
            <Button size={1}>9</Button>
            <Button size={1} color="gray">
              ×
            </Button>

            <Button size={1}>4</Button>
            <Button size={1}>5</Button>
            <Button size={1}>6</Button>
            <Button size={1} color="gray">
              -
            </Button>

            <Button size={1}>1</Button>
            <Button size={1}>2</Button>
            <Button size={1}>3</Button>
            <Button size={1} color="gray">
              +
            </Button>

            <Button size={2}>0</Button>
            <Button size={1}>.</Button>
            <Button size={1} color="gray">
              =
            </Button>
          </ButtonGroup>
        </Panel>
            {/* TODO: History componet를 이용해 map 함수와 Box styled div를 이용해 history 표시 */}
            <History historyValue={this.state.history} >
                {
                    this.state.history.map((x, i) =>
                        <Box margin={10} padding="8px 0 0 0"
                            
                        >
                            {x + ' = ' + evalFunc(x)}</Box>)
                }
               
            </History>
        </Container>

    );
  }
}

export default Calculator;
