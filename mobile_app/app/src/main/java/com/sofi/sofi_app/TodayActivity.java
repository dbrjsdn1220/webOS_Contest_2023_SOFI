package com.sofi.sofi_app;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.Calendar;


public class TodayActivity extends AppCompatActivity {
    RequestQueue queue;
    TextView TodayText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.today_activity_main);
        getSupportActionBar().setIcon(R.drawable.sofi_2);
        getSupportActionBar().setDisplayUseLogoEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        TodayText = (TextView) findViewById(R.id.TodayText);

        if(queue == null) {
            queue = Volley.newRequestQueue(this);
        }

        String url = "http://115.85.182.143:5501/getFood";

        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                String unitext = Today_UnicodeToUTF_8(response);
                String text = Today_StringToJson(unitext);
                TodayText.setText(text);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                TodayText.setText("에러: " + error.toString());
            }
        });
        queue.add(stringRequest);
    }
    public String Today_UnicodeToUTF_8(String uni){
        StringBuffer result = new StringBuffer();

        for(int i=0; i<uni.length(); i++){
            if(uni.charAt(i) == '\\' &&  uni.charAt(i+1) == 'u'){
                Character c = (char)Integer.parseInt(uni.substring(i+2, i+6), 16);
                result.append(c);
                i+=5;
            }else{
                result.append(uni.charAt(i));
            }
        }
        return result.toString();
    }

    public  String Today_StringToJson(String uni) {
        Calendar nowtime = Calendar.getInstance();
        String textserch, allergy, name, date, time, timecheck, nowdate = "", textall = "";
        String unitext = uni.substring(1,uni.length()-2);
        String text = unitext.replace("\n", "");

        nowtime.clear();
        nowtime = Calendar.getInstance();

        nowdate = nowdate + nowtime.get(Calendar.YEAR);
        nowdate = nowdate + (nowtime.get(Calendar.MONTH) + 1);
        nowdate = nowdate + nowtime.get(Calendar.DATE);
        while(true) {
            try {
                if (!text.contains("{") || !text.contains("}"))
                    break;

                textserch = text.substring(text.indexOf("{") + 1, text.indexOf("}") - 1);
                time = textserch.substring(textserch.indexOf("time")+8, textserch.length()-2);
                timecheck = time.replace("년 ","");
                timecheck = timecheck.replace("월 ", "");
                timecheck = timecheck.substring(0,timecheck.indexOf("일 "));

                text = text.substring(text.indexOf("}") + 1);
                allergy = textserch.substring(textserch.indexOf("[") + 1, textserch.indexOf("]"));
                allergy = allergy.replace("\"", "");
                allergy = allergy.replace(" ", "");
                allergy = allergy.replace(",", ", ");

                name = textserch.substring(textserch.indexOf("name") + 8, textserch.indexOf("time") - 7);

                date = textserch.substring(textserch.indexOf("date") + 8, textserch.indexOf("id") - 7);

                if (timecheck.equals(nowdate)) {
                    textall = "[" + time + "]\n제품명: " + name + "\n유통기한: " + date + "\n알러지: " + allergy + "\n\n" + textall;
                }
            }
            catch (IndexOutOfBoundsException e) {
                break;
            }
        }
        textall = nowdate + textall;
        return textall;
    }
}
