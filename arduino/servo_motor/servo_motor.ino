
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200); 
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
  pinMode(12, OUTPUT);
  digitalWrite(12, HIGH);
   pinMode(11, OUTPUT);
  digitalWrite(13, LOW);
   pinMode(3, OUTPUT);
  digitalWrite(3, LOW);
  //회로 연결 상태에 따라 LOW가 전진일지 HIGH가 전진인지 정해준다
  pinMode(7, INPUT);//라즈베리로 부터 받는 gpio
  digitalWrite(7, LOW);
  pinMode(6, OUTPUT);//돌아간 후 라즈베리에 입력
  digitalWrite(6, LOW);
} 

void loop() {
  
  if(digitalRead(7)==HIGH)
  {
    sub_moter();
    digitalWrite(6, HIGH);
    delay(500);
    digitalWrite(6, LOW);
  }
}

void sub_moter()
{
  //37이 대충 한바퀴 넘을때도 있는듯 
  int b=13;
  while(b>=0)
  {
  int a =200;
    analogWrite(11,a); 
    analogWrite(3,a);
    delay(100);
    a=0;
    analogWrite(11,a); 
    analogWrite(3,a);
    delay(100); 
    b--;
  }
}
