#define CNT 5; /* If you change this value, change it also at channels s and c declarations */

mtype = {s_sleep, s_receive, s_processing, s_done
	, c_idle, c_waiting};

/* Client */
chan c[5] = [1] of {int};

/* Server */
chan s = [5] of {byte, byte};
chan p[3] = [1] of {byte, byte};
byte jobs = 0;

/* LTL */
ltl R1 { [](s_done -> <> s_receive) };
ltl R2 { [](c_waiting U(c_idle)) };
ltl R3 { [](jobs <= 3) };
ltl R4 { []((c_waiting) -> !(s_sleep)) };


/* Client Process */
proctype client(byte i)
{
	mtype state = c_idle;
	
	byte y = 0;
	byte ack;
	
	do
		:: (state == c_idle) ->
			s ! y, i;
			c[i] ? ack;
			state = c_waiting;

		:: (state == c_waiting) ->
			c[i] ? y;
			y--;
			state = c_idle;
	
	od
}

/* Server Process */
proctype server()
{
	mtype state = s_sleep;
	
	byte x = 0;
	byte i;
	
	do
		:: (state == s_sleep) ->
			s ? x, i;
			state = s_receive;
	
		:: (state == s_receive) ->
			if
				:: p[0] ! x, i ->
					c[i] ! i;
					jobs++;
					state = s_processing;
				:: p[1] ! x, i ->
					c[i] ! i;
					jobs++;
					state = s_processing;
				:: p[2] ! x, i ->
					c[i] ! i;
					jobs++;
					state = s_processing;
			fi
	
		:: (state == s_processing) ->
			if
				:: p[0] ? x, i ->
					x++;
					state = s_done;
				:: p[1] ? x, i ->
					x++;
					state = s_done;
				:: p[2] ? x, i ->
					x++;
					state = s_done;
				:: (nempty(s) && jobs < 3) ->
					s ? x, i;
					state = s_receive;
				:: (empty(s) && jobs == 0) ->
					state = s_sleep;
			fi

		:: (state == s_done) ->
			c[i] ! x;
			jobs--;
			state = s_processing;
	od
}

/* init function */
init
{
	byte i = 0;
	{
		run server();
		do
			:: i < CNT ->
				run client(i);
				i++;
		od;
	}
}

