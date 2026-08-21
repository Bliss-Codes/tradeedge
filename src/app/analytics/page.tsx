"
u
s
e
 
c
l
i
e
n
t
"
;




i
m
p
o
r
t
 
{
 
u
s
e
M
e
m
o
,
 
u
s
e
S
t
a
t
e
 
}
 
f
r
o
m
 
"
r
e
a
c
t
"
;


i
m
p
o
r
t
 
{
 
u
s
e
A
p
p
,
 
u
s
e
V
i
s
i
b
l
e
T
r
a
d
e
s
,
 
u
s
e
D
i
s
p
l
a
y
C
u
r
r
e
n
c
y
,
 
C
a
p
i
t
a
l
S
t
a
g
e
,
 
s
t
a
g
e
O
f
 
}
 
f
r
o
m
 
"
@
/
s
t
o
r
e
s
/
u
s
e
A
p
p
"
;


i
m
p
o
r
t
 
{
 
i
s
o
W
e
e
k
K
e
y
,
 
d
e
d
u
p
e
B
y
S
e
t
u
p
,
 
s
e
t
u
p
C
o
u
n
t
s
 
}
 
f
r
o
m
 
"
@
/
l
i
b
/
m
e
t
r
i
c
s
"
;


i
m
p
o
r
t
 
{


 
 
c
o
m
p
u
t
e
S
t
a
t
s
,


 
 
t
y
p
e
 
S
t
a
t
s
,


 
 
e
q
u
i
t
y
C
u
r
v
e
,


 
 
f
m
t
P
F
,


 
 
f
m
t
P
c
t
,


 
 
f
m
t
R
,


 
 
f
m
t
M
o
n
e
y
,


 
 
s
t
a
t
s
B
y
G
r
o
u
p
,


 
 
t
a
g
C
o
m
b
o
s
,


 
 
e
x
e
c
u
t
i
o
n
S
u
m
m
a
r
y
,


 
 
e
x
e
c
u
t
i
o
n
F
i
n
d
i
n
g
s
,


 
 
r
u
l
e
A
d
h
e
r
e
n
c
e
,


 
 
a
d
h
e
r
e
n
c
e
D
e
t
a
i
l
,


 
 
q
u
a
d
r
a
n
t
O
f
,


 
 
T
r
a
d
e
T
y
p
e
,


 
 
a
d
h
e
r
e
n
c
e
T
r
e
n
d
,


 
 
s
t
a
t
s
B
y
H
o
u
r
,


 
 
d
i
s
t
r
i
b
u
t
i
o
n
,


 
 
w
i
n
L
o
s
s
S
u
m
m
a
r
y
,


 
 
a
v
g
P
l
a
n
n
e
d
R
R
,


 
 
b
r
e
a
k
e
v
e
n
M
i
s
s
e
s
,


 
 
f
i
l
t
e
r
B
y
M
o
n
e
y
S
c
o
p
e
,


 
 
m
o
n
e
y
S
p
l
i
t
,


 
 
M
o
n
e
y
S
c
o
p
e
,


 
 
m
o
n
t
h
l
y
P
e
r
f
o
r
m
a
n
c
e
,


 
 
s
i
g
n
C
o
l
o
r
,


}
 
f
r
o
m
 
"
@
/
l
i
b
/
m
e
t
r
i
c
s
"
;


i
m
p
o
r
t
 
t
y
p
e
 
{
 
M
o
n
t
h
l
y
Y
e
a
r
R
o
w
 
}
 
f
r
o
m
 
"
@
/
l
i
b
/
m
e
t
r
i
c
s
"
;


i
m
p
o
r
t
 
{
 
C
a
r
d
,
 
E
m
p
t
y
S
t
a
t
e
,
 
S
e
c
t
i
o
n
T
i
t
l
e
,
 
S
t
a
t
,
 
T
a
b
s
,
 
S
e
l
e
c
t
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
u
i
/
p
r
i
m
i
t
i
v
e
s
"
;


i
m
p
o
r
t
 
{
 
G
r
o
u
p
T
a
b
l
e
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
u
i
/
G
r
o
u
p
T
a
b
l
e
"
;


i
m
p
o
r
t
 
{
 
E
d
g
e
C
h
e
c
k
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
a
n
a
l
y
t
i
c
s
/
E
d
g
e
C
h
e
c
k
"
;


i
m
p
o
r
t
 
{
 
K
p
i
R
a
d
a
r
,
 
K
p
i
A
x
i
s
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
s
/
K
p
i
R
a
d
a
r
"
;


i
m
p
o
r
t
 
{
 
R
H
i
s
t
o
g
r
a
m
,
 
D
o
n
u
t
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
s
/
P
r
i
m
i
t
i
v
e
s
"
;


i
m
p
o
r
t
 
{
 
R
i
n
g
C
o
m
p
a
r
e
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
s
/
W
i
n
n
e
r
s
L
o
s
e
r
s
"
;


i
m
p
o
r
t
 
{
 
T
i
m
e
M
a
t
r
i
x
,
 
D
a
y
O
f
W
e
e
k
,
 
T
r
a
d
e
F
r
e
q
u
e
n
c
y
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
s
/
T
i
m
i
n
g
"
;


i
m
p
o
r
t
 
{
 
Y
e
a
r
H
e
a
t
m
a
p
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
s
/
Y
e
a
r
H
e
a
t
m
a
p
"
;


i
m
p
o
r
t
 
{
 
D
i
s
c
i
p
l
i
n
e
Q
u
a
d
r
a
n
t
,
 
Q
u
a
d
r
a
n
t
P
o
i
n
t
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
s
/
D
i
s
c
i
p
l
i
n
e
Q
u
a
d
r
a
n
t
"
;


i
m
p
o
r
t
 
{
 
E
q
u
i
t
y
C
u
r
v
e
,
 
B
a
r
R
o
w
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
s
/
E
q
u
i
t
y
C
u
r
v
e
"
;


i
m
p
o
r
t
 
{
 
S
e
s
s
i
o
n
R
a
d
a
r
 
}
 
f
r
o
m
 
"
@
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
s
/
S
e
s
s
i
o
n
R
a
d
a
r
"
;


i
m
p
o
r
t
 
{
 
G
R
A
D
E
S
,
 
E
X
I
T
_
R
E
A
S
O
N
S
,
 
Q
U
A
L
I
T
Y
_
L
A
B
E
L
S
,
 
S
E
S
S
I
O
N
S
,
 
o
u
t
c
o
m
e
O
f
,
 
T
r
a
d
e
 
}
 
f
r
o
m
 
"
@
/
l
i
b
/
t
y
p
e
s
"
;


i
m
p
o
r
t
 
{
 
a
v
a
i
l
a
b
l
e
B
r
e
a
k
d
o
w
n
F
i
e
l
d
s
,
 
f
i
e
l
d
V
a
l
u
e
B
y
N
a
m
e
,
 
s
t
r
a
t
e
g
y
M
a
p
 
}
 
f
r
o
m
 
"
@
/
l
i
b
/
f
i
e
l
d
s
"
;




c
o
n
s
t
 
T
A
B
S
 
=
 
[


 
 
"
O
v
e
r
v
i
e
w
"
,


 
 
"
B
r
e
a
k
d
o
w
n
s
"
,


 
 
"
T
i
m
i
n
g
"
,


 
 
"
E
x
i
t
s
"
,


 
 
"
Q
u
a
l
i
t
y
"
,


 
 
"
P
a
i
r
s
"
,


 
 
"
S
e
s
s
i
o
n
s
"
,


 
 
"
S
t
r
a
t
e
g
i
e
s
"
,


 
 
"
A
c
c
o
u
n
t
s
"
,


 
 
"
T
a
g
s
"
,


 
 
"
G
r
a
d
e
s
"
,


 
 
"
E
x
e
c
u
t
i
o
n
"
,


 
 
"
V
i
o
l
a
t
i
o
n
s
"
,


]
;




c
o
n
s
t
 
M
O
N
T
H
_
L
A
B
E
L
S
 
=
 
[
"
J
a
n
"
,
 
"
F
e
b
"
,
 
"
M
a
r
"
,
 
"
A
p
r
"
,
 
"
M
a
y
"
,
 
"
J
u
n
"
,
 
"
J
u
l
"
,
 
"
A
u
g
"
,
 
"
S
e
p
"
,
 
"
O
c
t
"
,
 
"
N
o
v
"
,
 
"
D
e
c
"
]
;




f
u
n
c
t
i
o
n
 
h
o
u
r
L
a
b
e
l
(
h
:
 
n
u
m
b
e
r
)
:
 
s
t
r
i
n
g
 
{


 
 
c
o
n
s
t
 
a
m
p
m
 
=
 
h
 
<
 
1
2
 
?
 
"
A
M
"
 
:
 
"
P
M
"
;


 
 
c
o
n
s
t
 
h
1
2
 
=
 
h
 
%
 
1
2
 
=
=
=
 
0
 
?
 
1
2
 
:
 
h
 
%
 
1
2
;


 
 
r
e
t
u
r
n
 
`
$
{
S
t
r
i
n
g
(
h
)
.
p
a
d
S
t
a
r
t
(
2
,
 
"
0
"
)
}
:
0
0
 
·
 
$
{
h
1
2
}
 
$
{
a
m
p
m
}
`
;


}




f
u
n
c
t
i
o
n
 
M
o
n
t
h
l
y
G
r
i
d
(
{
 
r
o
w
s
,
 
c
u
r
r
e
n
c
y
,
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
}
:
 
{
 
r
o
w
s
:
 
M
o
n
t
h
l
y
Y
e
a
r
R
o
w
[
]
;
 
c
u
r
r
e
n
c
y
:
 
s
t
r
i
n
g
;
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
?
:
 
n
u
m
b
e
r
 
}
)
 
{


 
 
c
o
n
s
t
 
[
m
o
d
e
,
 
s
e
t
M
o
d
e
]
 
=
 
u
s
e
S
t
a
t
e
<
"
m
o
n
e
y
"
 
|
 
"
p
c
t
"
>
(
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
?
 
"
p
c
t
"
 
:
 
"
m
o
n
e
y
"
)
;


 
 
i
f
 
(
r
o
w
s
.
l
e
n
g
t
h
 
=
=
=
 
0
)
 
r
e
t
u
r
n
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
8
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>
N
o
 
t
r
a
d
e
s
 
t
o
 
c
h
a
r
t
 
b
y
 
m
o
n
t
h
 
y
e
t
.
<
/
d
i
v
>
;




 
 
c
o
n
s
t
 
c
e
l
l
 
=
 
(
v
a
l
:
 
n
u
m
b
e
r
 
|
 
n
u
l
l
,
 
p
c
t
:
 
n
u
m
b
e
r
 
|
 
n
u
l
l
)
 
=
>
 
{


 
 
 
 
i
f
 
(
v
a
l
 
=
=
=
 
n
u
l
l
)
 
r
e
t
u
r
n
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
r
o
u
n
d
e
d
-
l
g
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
/
6
0
 
b
g
-
s
u
r
f
a
c
e
/
3
0
 
p
x
-
2
 
p
y
-
2
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
—
<
/
d
i
v
>
;


 
 
 
 
c
o
n
s
t
 
s
h
o
w
 
=
 
m
o
d
e
 
=
=
=
 
"
p
c
t
"
 
&
&
 
p
c
t
 
!
=
=
 
n
u
l
l
 
?
 
`
$
{
p
c
t
 
>
=
 
0
 
?
 
"
+
"
 
:
 
"
"
}
$
{
p
c
t
.
t
o
F
i
x
e
d
(
2
)
}
%
`
 
:
 
f
m
t
M
o
n
e
y
(
v
a
l
,
 
c
u
r
r
e
n
c
y
)
;


 
 
 
 
c
o
n
s
t
 
t
o
n
e
 
=
 
v
a
l
 
>
 
0
 
?
 
"
b
g
-
p
o
s
/
1
0
 
t
e
x
t
-
p
o
s
"
 
:
 
v
a
l
 
<
 
0
 
?
 
"
b
g
-
n
e
g
/
1
0
 
t
e
x
t
-
n
e
g
"
 
:
 
"
b
g
-
s
u
r
f
a
c
e
/
4
0
 
t
e
x
t
-
m
u
t
e
"
;


 
 
 
 
r
e
t
u
r
n
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
{
`
r
o
u
n
d
e
d
-
l
g
 
p
x
-
2
 
p
y
-
2
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
x
s
 
f
o
n
t
-
m
e
d
i
u
m
 
$
{
t
o
n
e
}
`
}
>
{
s
h
o
w
}
<
/
d
i
v
>
;


 
 
}
;




 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
d
i
v
>


 
 
 
 
 
 
{
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
?
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
3
 
f
l
e
x
 
g
a
p
-
1
 
t
e
x
t
-
x
s
"
>


 
 
 
 
 
 
 
 
 
 
<
b
u
t
t
o
n
 
o
n
C
l
i
c
k
=
{
(
)
 
=
>
 
s
e
t
M
o
d
e
(
"
p
c
t
"
)
}
 
c
l
a
s
s
N
a
m
e
=
{
`
r
o
u
n
d
e
d
-
l
g
 
p
x
-
2
.
5
 
p
y
-
1
 
t
r
a
n
s
i
t
i
o
n
-
c
o
l
o
r
s
 
$
{
m
o
d
e
 
=
=
=
 
"
p
c
t
"
 
?
 
"
b
g
-
a
c
c
e
n
t
 
t
e
x
t
-
b
g
"
 
:
 
"
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
 
t
e
x
t
-
m
u
t
e
 
h
o
v
e
r
:
t
e
x
t
-
s
u
b
"
}
`
}
>
%
 
r
e
t
u
r
n
<
/
b
u
t
t
o
n
>


 
 
 
 
 
 
 
 
 
 
<
b
u
t
t
o
n
 
o
n
C
l
i
c
k
=
{
(
)
 
=
>
 
s
e
t
M
o
d
e
(
"
m
o
n
e
y
"
)
}
 
c
l
a
s
s
N
a
m
e
=
{
`
r
o
u
n
d
e
d
-
l
g
 
p
x
-
2
.
5
 
p
y
-
1
 
t
r
a
n
s
i
t
i
o
n
-
c
o
l
o
r
s
 
$
{
m
o
d
e
 
=
=
=
 
"
m
o
n
e
y
"
 
?
 
"
b
g
-
a
c
c
e
n
t
 
t
e
x
t
-
b
g
"
 
:
 
"
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
 
t
e
x
t
-
m
u
t
e
 
h
o
v
e
r
:
t
e
x
t
-
s
u
b
"
}
`
}
>
{
c
u
r
r
e
n
c
y
}
<
/
b
u
t
t
o
n
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
3
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
S
e
t
 
a
 
s
t
a
r
t
i
n
g
 
b
a
l
a
n
c
e
 
o
n
 
t
h
e
 
a
c
c
o
u
n
t
 
t
o
 
s
e
e
 
%
 
r
e
t
u
r
n
s
.
<
/
p
>


 
 
 
 
 
 
)
}


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
o
v
e
r
f
l
o
w
-
x
-
a
u
t
o
"
>


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
i
n
-
w
-
[
7
6
0
p
x
]
"
>


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
1
.
5
 
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
[
5
6
p
x
_
r
e
p
e
a
t
(
1
2
,
1
f
r
)
_
7
2
p
x
]
 
g
a
p
-
1
.
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
{
M
O
N
T
H
_
L
A
B
E
L
S
.
m
a
p
(
(
m
)
 
=
>
 
<
d
i
v
 
k
e
y
=
{
m
}
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
[
1
0
p
x
]
 
f
o
n
t
-
m
e
d
i
u
m
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>
{
m
}
<
/
d
i
v
>
)
}


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
[
1
0
p
x
]
 
f
o
n
t
-
m
e
d
i
u
m
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>
Y
e
a
r
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
{
r
o
w
s
.
m
a
p
(
(
r
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
k
e
y
=
{
r
.
y
e
a
r
}
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
1
.
5
 
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
[
5
6
p
x
_
r
e
p
e
a
t
(
1
2
,
1
f
r
)
_
7
2
p
x
]
 
i
t
e
m
s
-
s
t
r
e
t
c
h
 
g
a
p
-
1
.
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
j
u
s
t
i
f
y
-
c
e
n
t
e
r
 
r
o
u
n
d
e
d
-
l
g
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
 
b
g
-
s
u
r
f
a
c
e
/
4
0
 
t
e
x
t
-
x
s
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
t
e
x
t
-
i
n
k
"
>
{
r
.
y
e
a
r
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
r
.
m
o
n
t
h
s
.
m
a
p
(
(
v
,
 
i
)
 
=
>
 
<
d
i
v
 
k
e
y
=
{
i
}
>
{
c
e
l
l
(
v
,
 
r
.
p
c
t
M
o
n
t
h
s
[
i
]
)
}
<
/
d
i
v
>
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
{
`
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
j
u
s
t
i
f
y
-
c
e
n
t
e
r
 
r
o
u
n
d
e
d
-
l
g
 
t
e
x
t
-
x
s
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
$
{
r
.
t
o
t
a
l
 
>
 
0
 
?
 
"
b
g
-
p
o
s
/
1
5
 
t
e
x
t
-
p
o
s
"
 
:
 
r
.
t
o
t
a
l
 
<
 
0
 
?
 
"
b
g
-
n
e
g
/
1
5
 
t
e
x
t
-
n
e
g
"
 
:
 
"
b
g
-
s
u
r
f
a
c
e
/
4
0
 
t
e
x
t
-
m
u
t
e
"
}
`
}
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
m
o
d
e
 
=
=
=
 
"
p
c
t
"
 
&
&
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
?
 
`
$
{
r
.
t
o
t
a
l
P
c
t
 
>
=
 
0
 
?
 
"
+
"
 
:
 
"
"
}
$
{
r
.
t
o
t
a
l
P
c
t
.
t
o
F
i
x
e
d
(
1
)
}
%
`
 
:
 
f
m
t
M
o
n
e
y
(
r
.
t
o
t
a
l
,
 
c
u
r
r
e
n
c
y
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
<
/
d
i
v
>


 
 
)
;


}




f
u
n
c
t
i
o
n
 
W
L
L
i
s
t
(
{
 
r
o
w
s
 
}
:
 
{
 
r
o
w
s
:
 
[
s
t
r
i
n
g
,
 
s
t
r
i
n
g
]
[
]
 
}
)
 
{


 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
d
i
v
i
d
e
-
y
 
d
i
v
i
d
e
-
e
d
g
e
/
5
0
"
>


 
 
 
 
 
 
{
r
o
w
s
.
m
a
p
(
(
[
k
,
 
v
]
)
 
=
>
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
k
e
y
=
{
k
}
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
j
u
s
t
i
f
y
-
b
e
t
w
e
e
n
 
p
y
-
2
 
t
e
x
t
-
s
m
"
>


 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
m
u
t
e
"
>
{
k
}
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
f
o
n
t
-
m
o
n
o
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
t
e
x
t
-
i
n
k
"
>
{
v
}
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
)
}


 
 
 
 
<
/
d
i
v
>


 
 
)
;


}






/
*
*
 
W
e
e
k
l
y
 
d
i
s
c
i
p
l
i
n
e
 
r
a
t
i
n
g
 
(
1
–
5
,
 
f
r
o
m
 
R
e
v
i
e
w
s
)
 
s
i
d
e
 
b
y
 
s
i
d
e
 
w
i
t
h
 
t
h
a
t
 
w
e
e
k
'
s
 
R
.
 
*
/


f
u
n
c
t
i
o
n
 
D
i
s
c
i
p
l
i
n
e
T
r
e
n
d
(
)
 
{


 
 
c
o
n
s
t
 
r
e
v
i
e
w
s
 
=
 
u
s
e
A
p
p
(
(
s
)
 
=
>
 
s
.
r
e
v
i
e
w
s
)
;


 
 
c
o
n
s
t
 
t
r
a
d
e
s
 
=
 
u
s
e
V
i
s
i
b
l
e
T
r
a
d
e
s
(
)
;




 
 
c
o
n
s
t
 
r
o
w
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
w
e
e
k
l
y
 
=
 
r
e
v
i
e
w
s
.
f
i
l
t
e
r
(
(
r
)
 
=
>
 
r
.
s
c
o
p
e
 
=
=
=
 
"
w
e
e
k
"
 
&
&
 
r
.
d
i
s
c
i
p
l
i
n
e
R
a
t
i
n
g
 
!
=
=
 
u
n
d
e
f
i
n
e
d
)
;


 
 
 
 
i
f
 
(
w
e
e
k
l
y
.
l
e
n
g
t
h
 
=
=
=
 
0
)
 
r
e
t
u
r
n
 
[
]
;


 
 
 
 
c
o
n
s
t
 
r
B
y
W
e
e
k
 
=
 
n
e
w
 
M
a
p
<
s
t
r
i
n
g
,
 
n
u
m
b
e
r
>
(
)
;


 
 
 
 
f
o
r
 
(
c
o
n
s
t
 
t
 
o
f
 
t
r
a
d
e
s
)
 
{


 
 
 
 
 
 
c
o
n
s
t
 
k
 
=
 
i
s
o
W
e
e
k
K
e
y
(
n
e
w
 
D
a
t
e
(
t
.
d
a
t
e
)
)
;


 
 
 
 
 
 
r
B
y
W
e
e
k
.
s
e
t
(
k
,
 
(
r
B
y
W
e
e
k
.
g
e
t
(
k
)
 
?
?
 
0
)
 
+
 
t
.
r
r
)
;


 
 
 
 
}


 
 
 
 
r
e
t
u
r
n
 
w
e
e
k
l
y


 
 
 
 
 
 
.
m
a
p
(
(
r
)
 
=
>
 
(
{
 
w
e
e
k
:
 
r
.
d
a
t
e
,
 
r
a
t
i
n
g
:
 
r
.
d
i
s
c
i
p
l
i
n
e
R
a
t
i
n
g
 
a
s
 
n
u
m
b
e
r
,
 
r
:
 
r
B
y
W
e
e
k
.
g
e
t
(
r
.
d
a
t
e
)
 
?
?
 
0
 
}
)
)


 
 
 
 
 
 
.
s
o
r
t
(
(
a
,
 
b
)
 
=
>
 
a
.
w
e
e
k
.
l
o
c
a
l
e
C
o
m
p
a
r
e
(
b
.
w
e
e
k
)
)


 
 
 
 
 
 
.
s
l
i
c
e
(
-
1
2
)
;


 
 
}
,
 
[
r
e
v
i
e
w
s
,
 
t
r
a
d
e
s
]
)
;




 
 
i
f
 
(
r
o
w
s
.
l
e
n
g
t
h
 
=
=
=
 
0
)
 
r
e
t
u
r
n
 
n
u
l
l
;


 
 
c
o
n
s
t
 
m
a
x
A
b
s
R
 
=
 
M
a
t
h
.
m
a
x
(
1
,
 
.
.
.
r
o
w
s
.
m
a
p
(
(
x
)
 
=
>
 
M
a
t
h
.
a
b
s
(
x
.
r
)
)
)
;




 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
 
a
c
t
i
o
n
=
{
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
l
a
s
t
 
{
r
o
w
s
.
l
e
n
g
t
h
}
 
r
a
t
e
d
 
w
e
e
k
{
r
o
w
s
.
l
e
n
g
t
h
 
=
=
=
 
1
 
?
 
"
"
 
:
 
"
s
"
}
<
/
s
p
a
n
>
}
>


 
 
 
 
 
 
 
 
D
i
s
c
i
p
l
i
n
e
 
v
s
 
p
e
r
f
o
r
m
a
n
c
e


 
 
 
 
 
 
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
p
a
c
e
-
y
-
1
"
>


 
 
 
 
 
 
 
 
{
r
o
w
s
.
m
a
p
(
(
x
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
k
e
y
=
{
x
.
w
e
e
k
}
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
g
a
p
-
3
 
p
y
-
1
"
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
w
-
2
0
 
s
h
r
i
n
k
-
0
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
{
x
.
w
e
e
k
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
w
-
2
4
 
s
h
r
i
n
k
-
0
 
g
a
p
-
1
"
 
t
i
t
l
e
=
{
`
D
i
s
c
i
p
l
i
n
e
 
$
{
x
.
r
a
t
i
n
g
}
/
5
`
}
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
[
1
,
 
2
,
 
3
,
 
4
,
 
5
]
.
m
a
p
(
(
n
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
k
e
y
=
{
n
}
 
c
l
a
s
s
N
a
m
e
=
{
`
h
-
2
.
5
 
w
-
2
.
5
 
r
o
u
n
d
e
d
-
s
m
 
$
{
n
 
<
=
 
x
.
r
a
t
i
n
g
 
?
 
(
x
.
r
a
t
i
n
g
 
>
=
 
4
 
?
 
"
b
g
-
p
o
s
"
 
:
 
x
.
r
a
t
i
n
g
 
>
=
 
3
 
?
 
"
b
g
-
w
a
r
n
"
 
:
 
"
b
g
-
n
e
g
"
)
 
:
 
"
b
g
-
s
u
r
f
a
c
e
"
}
`
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
r
e
l
a
t
i
v
e
 
h
-
2
 
f
l
e
x
-
1
 
o
v
e
r
f
l
o
w
-
h
i
d
d
e
n
 
r
o
u
n
d
e
d
-
f
u
l
l
 
b
g
-
s
u
r
f
a
c
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
l
a
s
s
N
a
m
e
=
"
a
b
s
o
l
u
t
e
 
t
o
p
-
0
 
h
-
f
u
l
l
 
r
o
u
n
d
e
d
-
f
u
l
l
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
s
t
y
l
e
=
{
{


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
l
e
f
t
:
 
x
.
r
 
>
=
 
0
 
?
 
"
5
0
%
"
 
:
 
`
$
{
5
0
 
-
 
(
M
a
t
h
.
a
b
s
(
x
.
r
)
 
/
 
m
a
x
A
b
s
R
)
 
*
 
5
0
}
%
`
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
w
i
d
t
h
:
 
`
$
{
(
M
a
t
h
.
a
b
s
(
x
.
r
)
 
/
 
m
a
x
A
b
s
R
)
 
*
 
5
0
}
%
`
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
b
a
c
k
g
r
o
u
n
d
C
o
l
o
r
:
 
x
.
r
 
>
=
 
0
 
?
 
"
r
g
b
(
v
a
r
(
-
-
p
o
s
)
)
"
 
:
 
"
r
g
b
(
v
a
r
(
-
-
n
e
g
)
)
"
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
}
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
a
b
s
o
l
u
t
e
 
l
e
f
t
-
1
/
2
 
t
o
p
-
0
 
h
-
f
u
l
l
 
w
-
p
x
 
b
g
-
e
d
g
e
"
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
{
`
w
-
1
6
 
s
h
r
i
n
k
-
0
 
t
e
x
t
-
r
i
g
h
t
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
x
s
 
$
{
s
i
g
n
C
o
l
o
r
(
x
.
r
)
}
`
}
>
{
f
m
t
R
(
x
.
r
)
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
3
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
R
a
t
e
 
e
a
c
h
 
w
e
e
k
 
i
n
 
R
e
v
i
e
w
s
 
—
 
o
v
e
r
 
t
i
m
e
 
t
h
i
s
 
s
h
o
w
s
 
w
h
e
t
h
e
r
 
y
o
u
r
 
g
r
e
e
n
 
w
e
e
k
s
 
a
r
e
 
a
l
s
o
 
y
o
u
r
 
d
i
s
c
i
p
l
i
n
e
d
 
o
n
e
s
.
<
/
p
>


 
 
 
 
<
/
C
a
r
d
>


 
 
)
;


}






/
*
*
 
T
h
e
 
s
i
x
 
K
P
I
s
 
t
h
a
t
 
d
e
f
i
n
e
 
t
h
e
 
p
r
o
p
-
t
r
a
d
i
n
g
 
s
w
e
e
t
 
s
p
o
t
,
 
a
s
 
o
n
e
 
s
h
a
p
e
.
 
*
/


f
u
n
c
t
i
o
n
 
K
p
i
S
c
o
r
e
c
a
r
d
(
)
 
{


 
 
c
o
n
s
t
 
t
r
a
d
e
s
 
=
 
u
s
e
V
i
s
i
b
l
e
T
r
a
d
e
s
(
)
;


 
 
c
o
n
s
t
 
s
t
a
t
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
c
o
m
p
u
t
e
S
t
a
t
s
(
d
e
d
u
p
e
B
y
S
e
t
u
p
(
t
r
a
d
e
s
)
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
a
d
h
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
a
d
h
e
r
e
n
c
e
D
e
t
a
i
l
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
a
d
h
e
r
e
n
c
e
 
=
 
a
d
h
.
p
c
t
;


 
 
c
o
n
s
t
 
t
h
e
s
i
s
R
a
t
e
 
=
 
u
s
e
M
e
m
o
(


 
 
 
 
(
)
 
=
>
 
(
t
r
a
d
e
s
.
l
e
n
g
t
h
 
?
 
(
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
(
t
.
t
h
e
s
i
s
 
?
?
 
"
"
)
.
t
r
i
m
(
)
)
.
l
e
n
g
t
h
 
/
 
t
r
a
d
e
s
.
l
e
n
g
t
h
)
 
*
 
1
0
0
 
:
 
0
)
,


 
 
 
 
[
t
r
a
d
e
s
]


 
 
)
;




 
 
i
f
 
(
t
r
a
d
e
s
.
l
e
n
g
t
h
 
=
=
=
 
0
)
 
r
e
t
u
r
n
 
n
u
l
l
;




 
 
c
o
n
s
t
 
w
i
n
s
 
=
 
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
=
=
=
 
"
w
i
n
"
)
;


 
 
c
o
n
s
t
 
a
v
g
W
i
n
R
 
=
 
w
i
n
s
.
l
e
n
g
t
h
 
?
 
w
i
n
s
.
r
e
d
u
c
e
(
(
s
,
 
t
)
 
=
>
 
s
 
+
 
M
a
t
h
.
a
b
s
(
t
.
r
r
)
,
 
0
)
 
/
 
w
i
n
s
.
l
e
n
g
t
h
 
:
 
0
;




 
 
c
o
n
s
t
 
a
x
e
s
:
 
K
p
i
A
x
i
s
[
]
 
=
 
[


 
 
 
 
{
 
k
e
y
:
 
"
e
x
p
"
,
 
l
a
b
e
l
:
 
"
E
x
p
e
c
t
a
n
c
y
"
,
 
v
a
l
u
e
:
 
M
a
t
h
.
m
a
x
(
0
,
 
s
t
a
t
s
.
a
v
g
R
R
)
,
 
t
a
r
g
e
t
:
 
0
.
3
,
 
m
a
x
:
 
1
.
0
,
 
f
o
r
m
a
t
:
 
(
v
)
 
=
>
 
`
$
{
v
.
t
o
F
i
x
e
d
(
2
)
}
R
`
 
}
,


 
 
 
 
{
 
k
e
y
:
 
"
w
r
"
,
 
l
a
b
e
l
:
 
"
W
i
n
 
r
a
t
e
"
,
 
v
a
l
u
e
:
 
s
t
a
t
s
.
w
i
n
R
a
t
e
,
 
t
a
r
g
e
t
:
 
4
5
,
 
m
a
x
:
 
7
0
,
 
f
o
r
m
a
t
:
 
(
v
)
 
=
>
 
`
$
{
v
.
t
o
F
i
x
e
d
(
0
)
}
%
`
 
}
,


 
 
 
 
{
 
k
e
y
:
 
"
r
r
"
,
 
l
a
b
e
l
:
 
"
A
v
g
 
w
i
n
n
e
r
"
,
 
v
a
l
u
e
:
 
a
v
g
W
i
n
R
,
 
t
a
r
g
e
t
:
 
2
,
 
m
a
x
:
 
4
,
 
f
o
r
m
a
t
:
 
(
v
)
 
=
>
 
`
$
{
v
.
t
o
F
i
x
e
d
(
1
)
}
R
`
 
}
,


 
 
 
 
{
 
k
e
y
:
 
"
p
f
"
,
 
l
a
b
e
l
:
 
"
P
r
o
f
i
t
 
f
a
c
t
o
r
"
,
 
v
a
l
u
e
:
 
M
a
t
h
.
m
i
n
(
s
t
a
t
s
.
p
r
o
f
i
t
F
a
c
t
o
r
,
 
4
)
,
 
t
a
r
g
e
t
:
 
1
.
5
,
 
m
a
x
:
 
3
,
 
f
o
r
m
a
t
:
 
(
v
)
 
=
>
 
v
.
t
o
F
i
x
e
d
(
2
)
 
}
,


 
 
 
 
{
 
k
e
y
:
 
"
a
d
h
"
,
 
l
a
b
e
l
:
 
"
A
d
h
e
r
e
n
c
e
"
,
 
v
a
l
u
e
:
 
a
d
h
e
r
e
n
c
e
,
 
t
a
r
g
e
t
:
 
9
0
,
 
m
a
x
:
 
1
0
0
,
 
f
o
r
m
a
t
:
 
(
v
)
 
=
>
 
(
a
d
h
.
t
o
t
a
l
 
=
=
=
 
0
 
?
 
"
—
"
 
:
 
`
$
{
v
.
t
o
F
i
x
e
d
(
0
)
}
%
`
)
 
}
,


 
 
 
 
{
 
k
e
y
:
 
"
t
h
"
,
 
l
a
b
e
l
:
 
"
T
h
e
s
i
s
 
r
a
t
e
"
,
 
v
a
l
u
e
:
 
t
h
e
s
i
s
R
a
t
e
,
 
t
a
r
g
e
t
:
 
1
0
0
,
 
m
a
x
:
 
1
0
0
,
 
f
o
r
m
a
t
:
 
(
v
)
 
=
>
 
`
$
{
v
.
t
o
F
i
x
e
d
(
0
)
}
%
`
 
}
,


 
 
]
;




 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
 
a
c
t
i
o
n
=
{
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
v
s
 
p
r
o
p
 
s
w
e
e
t
 
s
p
o
t
<
/
s
p
a
n
>
}
>
K
P
I
 
s
c
o
r
e
c
a
r
d
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
x
-
a
u
t
o
 
m
a
x
-
w
-
m
d
"
>


 
 
 
 
 
 
 
 
<
K
p
i
R
a
d
a
r
 
a
x
e
s
=
{
a
x
e
s
}
 
/
>


 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
2
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
D
a
s
h
e
d
 
r
i
n
g
 
i
s
 
t
h
e
 
t
a
r
g
e
t
.
 
A
n
y
 
p
o
i
n
t
 
i
n
s
i
d
e
 
i
t
 
i
s
 
t
h
e
 
K
P
I
 
t
o
 
w
o
r
k
 
o
n
 
n
e
x
t
.


 
 
 
 
 
 
 
 
{
a
d
h
.
n
o
T
h
e
s
i
s
 
>
 
0
 
&
&
 
`
 
A
d
h
e
r
e
n
c
e
 
c
o
u
n
t
s
 
e
v
e
r
y
 
t
r
a
d
e
 
—
 
$
{
a
d
h
.
n
o
T
h
e
s
i
s
}
 
h
a
d
 
n
o
 
t
h
e
s
i
s
,
 
w
h
i
c
h
 
i
s
 
a
 
p
l
a
n
 
b
r
e
a
k
 
b
y
 
y
o
u
r
 
o
w
n
 
r
u
l
e
.
`
}


 
 
 
 
 
 
<
/
p
>


 
 
 
 
<
/
C
a
r
d
>


 
 
)
;


}






/
*
*
 
W
e
e
k
l
y
 
d
i
s
c
i
p
l
i
n
e
 
v
s
 
w
e
e
k
l
y
 
R
,
 
q
u
a
d
r
a
n
t
-
s
h
a
d
e
d
.
 
*
/


f
u
n
c
t
i
o
n
 
D
i
s
c
i
p
l
i
n
e
S
c
a
t
t
e
r
(
)
 
{


 
 
c
o
n
s
t
 
r
e
v
i
e
w
s
 
=
 
u
s
e
A
p
p
(
(
s
)
 
=
>
 
s
.
r
e
v
i
e
w
s
)
;


 
 
c
o
n
s
t
 
t
r
a
d
e
s
 
=
 
u
s
e
V
i
s
i
b
l
e
T
r
a
d
e
s
(
)
;


 
 
c
o
n
s
t
 
p
o
i
n
t
s
 
=
 
u
s
e
M
e
m
o
<
Q
u
a
d
r
a
n
t
P
o
i
n
t
[
]
>
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
r
B
y
W
e
e
k
 
=
 
n
e
w
 
M
a
p
<
s
t
r
i
n
g
,
 
n
u
m
b
e
r
>
(
)
;


 
 
 
 
f
o
r
 
(
c
o
n
s
t
 
t
 
o
f
 
t
r
a
d
e
s
)
 
{


 
 
 
 
 
 
c
o
n
s
t
 
k
 
=
 
i
s
o
W
e
e
k
K
e
y
(
n
e
w
 
D
a
t
e
(
t
.
d
a
t
e
)
)
;


 
 
 
 
 
 
r
B
y
W
e
e
k
.
s
e
t
(
k
,
 
(
r
B
y
W
e
e
k
.
g
e
t
(
k
)
 
?
?
 
0
)
 
+
 
t
.
r
r
)
;


 
 
 
 
}


 
 
 
 
r
e
t
u
r
n
 
r
e
v
i
e
w
s


 
 
 
 
 
 
.
f
i
l
t
e
r
(
(
r
)
 
=
>
 
r
.
s
c
o
p
e
 
=
=
=
 
"
w
e
e
k
"
 
&
&
 
r
.
d
i
s
c
i
p
l
i
n
e
R
a
t
i
n
g
 
!
=
=
 
u
n
d
e
f
i
n
e
d
)


 
 
 
 
 
 
.
m
a
p
(
(
r
)
 
=
>
 
(
{
 
l
a
b
e
l
:
 
r
.
d
a
t
e
,
 
x
:
 
r
.
d
i
s
c
i
p
l
i
n
e
R
a
t
i
n
g
 
a
s
 
n
u
m
b
e
r
,
 
y
:
 
r
B
y
W
e
e
k
.
g
e
t
(
r
.
d
a
t
e
)
 
?
?
 
0
 
}
)
)


 
 
 
 
 
 
.
s
o
r
t
(
(
a
,
 
b
)
 
=
>
 
a
.
l
a
b
e
l
.
l
o
c
a
l
e
C
o
m
p
a
r
e
(
b
.
l
a
b
e
l
)
)
;


 
 
}
,
 
[
r
e
v
i
e
w
s
,
 
t
r
a
d
e
s
]
)
;




 
 
i
f
 
(
p
o
i
n
t
s
.
l
e
n
g
t
h
 
=
=
=
 
0
)
 
r
e
t
u
r
n
 
n
u
l
l
;




 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
 
a
c
t
i
o
n
=
{
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
{
p
o
i
n
t
s
.
l
e
n
g
t
h
}
 
r
a
t
e
d
 
w
e
e
k
s
<
/
s
p
a
n
>
}
>
D
o
e
s
 
d
i
s
c
i
p
l
i
n
e
 
p
a
y
?
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
<
D
i
s
c
i
p
l
i
n
e
Q
u
a
d
r
a
n
t
 
p
o
i
n
t
s
=
{
p
o
i
n
t
s
}
 
/
>


 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
2
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
I
f
 
t
h
e
 
d
o
t
s
 
t
r
e
n
d
 
u
p
-
r
i
g
h
t
,
 
y
o
u
r
 
p
r
o
c
e
s
s
 
—
 
n
o
t
 
t
h
e
 
m
a
r
k
e
t
 
—
 
i
s
 
w
h
a
t
 
p
a
y
s
 
y
o
u
.


 
 
 
 
 
 
<
/
p
>


 
 
 
 
<
/
C
a
r
d
>


 
 
)
;


}






/
*
*
 
C
o
m
p
a
c
t
 
d
r
o
p
d
o
w
n
 
s
t
y
l
e
d
 
a
s
 
a
 
p
i
l
l
 
—
 
q
u
i
e
t
 
u
n
t
i
l
 
a
c
t
i
v
e
.
 
*
/


f
u
n
c
t
i
o
n
 
F
i
l
t
e
r
P
i
l
l
(
{


 
 
l
a
b
e
l
,


 
 
v
a
l
u
e
,


 
 
o
p
t
i
o
n
s
,


 
 
o
n
C
h
a
n
g
e
,


}
:
 
{


 
 
l
a
b
e
l
:
 
s
t
r
i
n
g
;


 
 
v
a
l
u
e
:
 
s
t
r
i
n
g
;


 
 
o
p
t
i
o
n
s
:
 
[
s
t
r
i
n
g
,
 
s
t
r
i
n
g
]
[
]
;


 
 
o
n
C
h
a
n
g
e
:
 
(
v
:
 
s
t
r
i
n
g
)
 
=
>
 
v
o
i
d
;


}
)
 
{


 
 
c
o
n
s
t
 
a
c
t
i
v
e
 
=
 
B
o
o
l
e
a
n
(
v
a
l
u
e
)
;


 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
r
e
l
a
t
i
v
e
"
>


 
 
 
 
 
 
<
s
e
l
e
c
t


 
 
 
 
 
 
 
 
v
a
l
u
e
=
{
v
a
l
u
e
}


 
 
 
 
 
 
 
 
o
n
C
h
a
n
g
e
=
{
(
e
)
 
=
>
 
o
n
C
h
a
n
g
e
(
e
.
t
a
r
g
e
t
.
v
a
l
u
e
)
}


 
 
 
 
 
 
 
 
c
l
a
s
s
N
a
m
e
=
{
`
a
p
p
e
a
r
a
n
c
e
-
n
o
n
e
 
r
o
u
n
d
e
d
-
f
u
l
l
 
b
o
r
d
e
r
 
p
y
-
1
.
5
 
p
l
-
3
.
5
 
p
r
-
8
 
t
e
x
t
-
x
s
 
o
u
t
l
i
n
e
-
n
o
n
e
 
t
r
a
n
s
i
t
i
o
n
 
$
{


 
 
 
 
 
 
 
 
 
 
a
c
t
i
v
e
 
?
 
"
b
o
r
d
e
r
-
a
c
c
e
n
t
/
6
0
 
b
g
-
a
c
c
e
n
t
/
1
0
 
t
e
x
t
-
a
c
c
e
n
t
"
 
:
 
"
b
o
r
d
e
r
-
e
d
g
e
 
b
g
-
c
a
r
d
 
t
e
x
t
-
s
u
b
 
h
o
v
e
r
:
b
o
r
d
e
r
-
m
u
t
e
/
5
0
"


 
 
 
 
 
 
 
 
}
`
}


 
 
 
 
 
 
>


 
 
 
 
 
 
 
 
{
o
p
t
i
o
n
s
.
m
a
p
(
(
[
v
,
 
l
]
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
<
o
p
t
i
o
n
 
k
e
y
=
{
v
}
 
v
a
l
u
e
=
{
v
}
>


 
 
 
 
 
 
 
 
 
 
 
 
{
v
 
=
=
=
 
"
"
 
|
|
 
v
 
=
=
=
 
"
a
l
l
"
 
?
 
l
a
b
e
l
 
:
 
l
}


 
 
 
 
 
 
 
 
 
 
<
/
o
p
t
i
o
n
>


 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
<
/
s
e
l
e
c
t
>


 
 
 
 
 
 
<
s
v
g
 
c
l
a
s
s
N
a
m
e
=
"
p
o
i
n
t
e
r
-
e
v
e
n
t
s
-
n
o
n
e
 
a
b
s
o
l
u
t
e
 
r
i
g
h
t
-
3
 
t
o
p
-
1
/
2
 
h
-
3
 
w
-
3
 
-
t
r
a
n
s
l
a
t
e
-
y
-
1
/
2
 
o
p
a
c
i
t
y
-
6
0
"
 
v
i
e
w
B
o
x
=
"
0
 
0
 
2
4
 
2
4
"
 
f
i
l
l
=
"
n
o
n
e
"
 
s
t
r
o
k
e
=
"
c
u
r
r
e
n
t
C
o
l
o
r
"
 
s
t
r
o
k
e
W
i
d
t
h
=
"
2
.
5
"
>


 
 
 
 
 
 
 
 
<
p
a
t
h
 
d
=
"
M
6
 
9
l
6
 
6
 
6
-
6
"
 
/
>


 
 
 
 
 
 
<
/
s
v
g
>


 
 
 
 
<
/
d
i
v
>


 
 
)
;


}




/
*
*
 
A
c
t
i
v
e
-
f
i
l
t
e
r
 
c
h
i
p
 
w
i
t
h
 
a
n
 
i
n
l
i
n
e
 
c
l
e
a
r
.
 
*
/


f
u
n
c
t
i
o
n
 
F
i
l
t
e
r
C
h
i
p
(
{
 
l
a
b
e
l
,
 
o
n
C
l
e
a
r
 
}
:
 
{
 
l
a
b
e
l
:
 
s
t
r
i
n
g
;
 
o
n
C
l
e
a
r
:
 
(
)
 
=
>
 
v
o
i
d
 
}
)
 
{


 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
i
n
l
i
n
e
-
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
g
a
p
-
1
.
5
 
r
o
u
n
d
e
d
-
f
u
l
l
 
b
g
-
s
u
r
f
a
c
e
 
p
x
-
2
.
5
 
p
y
-
1
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
s
u
b
"
>


 
 
 
 
 
 
{
l
a
b
e
l
}


 
 
 
 
 
 
<
b
u
t
t
o
n
 
o
n
C
l
i
c
k
=
{
o
n
C
l
e
a
r
}
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
m
u
t
e
 
t
r
a
n
s
i
t
i
o
n
 
h
o
v
e
r
:
t
e
x
t
-
n
e
g
"
 
a
r
i
a
-
l
a
b
e
l
=
{
`
C
l
e
a
r
 
$
{
l
a
b
e
l
}
`
}
>


 
 
 
 
 
 
 
 
×


 
 
 
 
 
 
<
/
b
u
t
t
o
n
>


 
 
 
 
<
/
s
p
a
n
>


 
 
)
;


}






/
*
*
 
I
n
l
i
n
e
 
s
t
a
t
 
f
o
r
 
c
h
a
r
t
-
c
a
r
d
 
h
e
a
d
e
r
s
.
 
*
/


f
u
n
c
t
i
o
n
 
H
e
a
d
S
t
a
t
(
{


 
 
l
a
b
e
l
,


 
 
v
a
l
u
e
,


 
 
t
o
n
e
,


 
 
s
u
p
,


 
 
d
e
l
t
a
,


}
:
 
{


 
 
l
a
b
e
l
:
 
s
t
r
i
n
g
;


 
 
v
a
l
u
e
:
 
s
t
r
i
n
g
;


 
 
t
o
n
e
?
:
 
n
u
m
b
e
r
;


 
 
s
u
p
?
:
 
s
t
r
i
n
g
;


 
 
d
e
l
t
a
?
:
 
n
u
m
b
e
r
;


}
)
 
{


 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
d
i
v
>


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
{
l
a
b
e
l
}
<
/
d
i
v
>


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
f
l
e
x
 
i
t
e
m
s
-
b
a
s
e
l
i
n
e
 
g
a
p
-
2
"
>


 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
{
`
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
$
{
t
o
n
e
 
!
=
=
 
u
n
d
e
f
i
n
e
d
 
?
 
s
i
g
n
C
o
l
o
r
(
t
o
n
e
)
 
:
 
"
t
e
x
t
-
i
n
k
"
}
`
}
>


 
 
 
 
 
 
 
 
 
 
{
v
a
l
u
e
}


 
 
 
 
 
 
 
 
 
 
{
s
u
p
 
&
&
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
m
l
-
1
 
a
l
i
g
n
-
s
u
p
e
r
 
t
e
x
t
-
[
1
1
p
x
]
 
f
o
n
t
-
n
o
r
m
a
l
 
t
e
x
t
-
m
u
t
e
"
>
{
s
u
p
}
<
/
s
p
a
n
>
}


 
 
 
 
 
 
 
 
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
{
d
e
l
t
a
 
!
=
=
 
u
n
d
e
f
i
n
e
d
 
&
&
 
N
u
m
b
e
r
.
i
s
F
i
n
i
t
e
(
d
e
l
t
a
)
 
&
&
 
(


 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
{
`
t
e
x
t
-
x
s
 
$
{
d
e
l
t
a
 
>
=
 
0
 
?
 
"
t
e
x
t
-
p
o
s
"
 
:
 
"
t
e
x
t
-
n
e
g
"
}
`
}
>


 
 
 
 
 
 
 
 
 
 
 
 
{
d
e
l
t
a
 
>
=
 
0
 
?
 
"
▲
"
 
:
 
"
▼
"
}
 
{
M
a
t
h
.
a
b
s
(
d
e
l
t
a
)
.
t
o
F
i
x
e
d
(
2
)
}
%


 
 
 
 
 
 
 
 
 
 
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
<
/
d
i
v
>


 
 
)
;


}




/
*
*
 
C
o
m
p
a
c
t
 
m
e
t
r
i
c
 
c
a
r
d
 
w
i
t
h
 
a
 
s
p
a
r
k
l
i
n
e
 
s
i
t
t
i
n
g
 
f
l
u
s
h
 
a
t
 
t
h
e
 
b
o
t
t
o
m
.
 
*
/


f
u
n
c
t
i
o
n
 
M
i
n
i
M
e
t
r
i
c
(
{


 
 
l
a
b
e
l
,


 
 
v
a
l
u
e
,


 
 
r
i
g
h
t
L
a
b
e
l
,


 
 
r
i
g
h
t
V
a
l
u
e
,


 
 
s
e
r
i
e
s
,


 
 
n
o
t
e
,


}
:
 
{


 
 
l
a
b
e
l
:
 
s
t
r
i
n
g
;


 
 
v
a
l
u
e
:
 
s
t
r
i
n
g
;


 
 
r
i
g
h
t
L
a
b
e
l
:
 
s
t
r
i
n
g
;


 
 
r
i
g
h
t
V
a
l
u
e
:
 
s
t
r
i
n
g
;


 
 
s
e
r
i
e
s
:
 
n
u
m
b
e
r
[
]
;


 
 
n
o
t
e
?
:
 
s
t
r
i
n
g
;


}
)
 
{


 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
r
e
l
a
t
i
v
e
 
o
v
e
r
f
l
o
w
-
h
i
d
d
e
n
 
r
o
u
n
d
e
d
-
2
x
l
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
 
b
g
-
c
a
r
d
 
p
t
-
4
"
>


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
i
t
e
m
s
-
s
t
a
r
t
 
j
u
s
t
i
f
y
-
b
e
t
w
e
e
n
 
p
x
-
4
"
>


 
 
 
 
 
 
 
 
<
d
i
v
>


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
{
l
a
b
e
l
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
t
e
x
t
-
i
n
k
"
>
{
v
a
l
u
e
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
r
i
g
h
t
"
>


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
{
r
i
g
h
t
L
a
b
e
l
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
s
m
 
t
e
x
t
-
s
u
b
"
>
{
r
i
g
h
t
V
a
l
u
e
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
{
n
o
t
e
 
&
&
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
2
 
p
x
-
4
 
t
e
x
t
-
[
1
1
p
x
]
 
l
e
a
d
i
n
g
-
s
n
u
g
 
t
e
x
t
-
m
u
t
e
"
>
{
n
o
t
e
}
<
/
d
i
v
>
}


 
 
 
 
 
 
{
s
e
r
i
e
s
.
l
e
n
g
t
h
 
>
 
1
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
2
"
>


 
 
 
 
 
 
 
 
 
 
<
M
i
n
i
A
r
e
a
 
v
a
l
u
e
s
=
{
s
e
r
i
e
s
}
 
/
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}


 
 
 
 
 
 
{
s
e
r
i
e
s
.
l
e
n
g
t
h
 
<
=
 
1
 
&
&
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
h
-
4
"
 
/
>
}


 
 
 
 
<
/
d
i
v
>


 
 
)
;


}




/
*
*
 
E
d
g
e
-
t
o
-
e
d
g
e
 
a
r
e
a
 
s
p
a
r
k
l
i
n
e
 
f
o
r
 
M
i
n
i
M
e
t
r
i
c
.
 
*
/


f
u
n
c
t
i
o
n
 
M
i
n
i
A
r
e
a
(
{
 
v
a
l
u
e
s
,
 
h
e
i
g
h
t
 
=
 
4
6
 
}
:
 
{
 
v
a
l
u
e
s
:
 
n
u
m
b
e
r
[
]
;
 
h
e
i
g
h
t
?
:
 
n
u
m
b
e
r
 
}
)
 
{


 
 
c
o
n
s
t
 
m
i
n
 
=
 
M
a
t
h
.
m
i
n
(
.
.
.
v
a
l
u
e
s
)
;


 
 
c
o
n
s
t
 
m
a
x
 
=
 
M
a
t
h
.
m
a
x
(
.
.
.
v
a
l
u
e
s
)
;


 
 
c
o
n
s
t
 
r
a
n
g
e
 
=
 
m
a
x
 
-
 
m
i
n
 
|
|
 
1
;


 
 
c
o
n
s
t
 
W
 
=
 
3
0
0
;


 
 
c
o
n
s
t
 
p
t
s
 
=
 
v
a
l
u
e
s
.
m
a
p
(
(
v
,
 
i
)
 
=
>
 
[
(
i
 
/
 
(
v
a
l
u
e
s
.
l
e
n
g
t
h
 
-
 
1
)
)
 
*
 
W
,
 
h
e
i
g
h
t
 
-
 
(
(
v
 
-
 
m
i
n
)
 
/
 
r
a
n
g
e
)
 
*
 
(
h
e
i
g
h
t
 
-
 
6
)
 
-
 
3
]
)
;


 
 
c
o
n
s
t
 
l
i
n
e
 
=
 
p
t
s
.
m
a
p
(
(
p
)
 
=
>
 
`
$
{
p
[
0
]
}
,
$
{
p
[
1
]
}
`
)
.
j
o
i
n
(
"
 
"
)
;


 
 
c
o
n
s
t
 
a
r
e
a
 
=
 
`
$
{
l
i
n
e
}
 
$
{
W
}
,
$
{
h
e
i
g
h
t
}
 
0
,
$
{
h
e
i
g
h
t
}
`
;


 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
s
v
g
 
v
i
e
w
B
o
x
=
{
`
0
 
0
 
$
{
W
}
 
$
{
h
e
i
g
h
t
}
`
}
 
p
r
e
s
e
r
v
e
A
s
p
e
c
t
R
a
t
i
o
=
"
n
o
n
e
"
 
c
l
a
s
s
N
a
m
e
=
"
b
l
o
c
k
 
w
-
f
u
l
l
"
 
s
t
y
l
e
=
{
{
 
h
e
i
g
h
t
 
}
}
>


 
 
 
 
 
 
<
p
o
l
y
g
o
n
 
p
o
i
n
t
s
=
{
a
r
e
a
}
 
f
i
l
l
=
"
r
g
b
(
v
a
r
(
-
-
a
c
c
e
n
t
)
 
/
 
0
.
1
2
)
"
 
/
>


 
 
 
 
 
 
<
p
o
l
y
l
i
n
e
 
p
o
i
n
t
s
=
{
l
i
n
e
}
 
f
i
l
l
=
"
n
o
n
e
"
 
s
t
r
o
k
e
=
"
r
g
b
(
v
a
r
(
-
-
a
c
c
e
n
t
)
)
"
 
s
t
r
o
k
e
W
i
d
t
h
=
{
1
.
7
5
}
 
s
t
r
o
k
e
L
i
n
e
j
o
i
n
=
"
r
o
u
n
d
"
 
v
e
c
t
o
r
E
f
f
e
c
t
=
"
n
o
n
-
s
c
a
l
i
n
g
-
s
t
r
o
k
e
"
 
/
>


 
 
 
 
<
/
s
v
g
>


 
 
)
;


}






/
*
*
 
P
r
o
f
i
t
-
f
a
c
t
o
r
 
r
i
n
g
.
 
F
i
l
l
s
 
p
r
o
p
o
r
t
i
o
n
a
l
l
y
 
u
p
 
t
o
 
3
.
0
 
s
o
 
t
h
e
 
a
r
c
 
m
e
a
n
s
 
s
o
m
e
t
h
i
n
g


 
*
 
 
(
t
h
e
 
r
e
f
e
r
e
n
c
e
'
s
 
v
e
r
s
i
o
n
 
w
a
s
 
a
n
 
e
m
p
t
y
 
c
i
r
c
l
e
 
s
h
o
w
i
n
g
 
n
o
t
h
i
n
g
)
.
 
*
/


f
u
n
c
t
i
o
n
 
P
F
R
i
n
g
(
{
 
v
a
l
u
e
,
 
s
i
z
e
 
=
 
7
4
 
}
:
 
{
 
v
a
l
u
e
:
 
n
u
m
b
e
r
;
 
s
i
z
e
?
:
 
n
u
m
b
e
r
 
}
)
 
{


 
 
c
o
n
s
t
 
R
 
=
 
(
s
i
z
e
 
-
 
9
)
 
/
 
2
;


 
 
c
o
n
s
t
 
C
 
=
 
2
 
*
 
M
a
t
h
.
P
I
 
*
 
R
;


 
 
c
o
n
s
t
 
f
r
a
c
 
=
 
M
a
t
h
.
m
a
x
(
0
,
 
M
a
t
h
.
m
i
n
(
1
,
 
(
N
u
m
b
e
r
.
i
s
F
i
n
i
t
e
(
v
a
l
u
e
)
 
?
 
v
a
l
u
e
 
:
 
3
)
 
/
 
3
)
)
;


 
 
c
o
n
s
t
 
c
o
l
o
r
 
=
 
v
a
l
u
e
 
>
=
 
1
.
5
 
?
 
"
r
g
b
(
v
a
r
(
-
-
p
o
s
)
)
"
 
:
 
v
a
l
u
e
 
>
=
 
1
 
?
 
"
r
g
b
(
v
a
r
(
-
-
w
a
r
n
)
)
"
 
:
 
"
r
g
b
(
v
a
r
(
-
-
n
e
g
)
)
"
;


 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
s
v
g
 
w
i
d
t
h
=
{
s
i
z
e
}
 
h
e
i
g
h
t
=
{
s
i
z
e
}
 
v
i
e
w
B
o
x
=
{
`
0
 
0
 
$
{
s
i
z
e
}
 
$
{
s
i
z
e
}
`
}
 
c
l
a
s
s
N
a
m
e
=
"
s
h
r
i
n
k
-
0
"
 
r
o
l
e
=
"
i
m
g
"
 
a
r
i
a
-
l
a
b
e
l
=
"
p
r
o
f
i
t
 
f
a
c
t
o
r
"
>


 
 
 
 
 
 
<
c
i
r
c
l
e
 
c
x
=
{
s
i
z
e
 
/
 
2
}
 
c
y
=
{
s
i
z
e
 
/
 
2
}
 
r
=
{
R
}
 
f
i
l
l
=
"
n
o
n
e
"
 
s
t
r
o
k
e
=
"
r
g
b
(
v
a
r
(
-
-
s
u
r
f
a
c
e
)
)
"
 
s
t
r
o
k
e
W
i
d
t
h
=
{
7
}
 
/
>


 
 
 
 
 
 
<
g
 
t
r
a
n
s
f
o
r
m
=
{
`
r
o
t
a
t
e
(
-
9
0
 
$
{
s
i
z
e
 
/
 
2
}
 
$
{
s
i
z
e
 
/
 
2
}
)
`
}
>


 
 
 
 
 
 
 
 
<
c
i
r
c
l
e


 
 
 
 
 
 
 
 
 
 
c
x
=
{
s
i
z
e
 
/
 
2
}


 
 
 
 
 
 
 
 
 
 
c
y
=
{
s
i
z
e
 
/
 
2
}


 
 
 
 
 
 
 
 
 
 
r
=
{
R
}


 
 
 
 
 
 
 
 
 
 
f
i
l
l
=
"
n
o
n
e
"


 
 
 
 
 
 
 
 
 
 
s
t
r
o
k
e
=
{
c
o
l
o
r
}


 
 
 
 
 
 
 
 
 
 
s
t
r
o
k
e
W
i
d
t
h
=
{
7
}


 
 
 
 
 
 
 
 
 
 
s
t
r
o
k
e
L
i
n
e
c
a
p
=
"
r
o
u
n
d
"


 
 
 
 
 
 
 
 
 
 
s
t
r
o
k
e
D
a
s
h
a
r
r
a
y
=
{
`
$
{
f
r
a
c
 
*
 
C
}
 
$
{
C
}
`
}


 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
<
/
g
>


 
 
 
 
<
/
s
v
g
>


 
 
)
;


}






/
*
*
 
P
l
a
n
-
f
o
l
l
o
w
i
n
g
 
t
r
a
d
e
s
 
a
g
a
i
n
s
t
 
o
f
f
-
p
l
a
n
 
o
n
e
s
.
 
T
h
i
s
 
i
s
 
u
s
u
a
l
l
y
 
t
h
e
 
s
i
n
g
l
e


 
*
 
 
m
o
s
t
 
v
a
l
u
a
b
l
e
 
s
p
l
i
t
 
i
n
 
t
h
e
 
j
o
u
r
n
a
l
:
 
i
t
 
s
e
p
a
r
a
t
e
s
 
t
h
e
 
s
y
s
t
e
m
'
s
 
e
d
g
e
 
f
r
o
m


 
*
 
 
t
h
e
 
c
o
s
t
 
o
f
 
d
e
v
i
a
t
i
n
g
 
f
r
o
m
 
i
t
.
 
*
/


f
u
n
c
t
i
o
n
 
P
l
a
n
V
s
O
f
f
P
l
a
n
(
{
 
t
r
a
d
e
s
,
 
c
u
r
r
e
n
c
y
 
}
:
 
{
 
t
r
a
d
e
s
:
 
T
r
a
d
e
[
]
;
 
c
u
r
r
e
n
c
y
:
 
s
t
r
i
n
g
 
}
)
 
{


 
 
c
o
n
s
t
 
m
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
o
f
f
 
=
 
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
t
.
f
o
l
l
o
w
e
d
P
l
a
n
 
=
=
=
 
f
a
l
s
e
)
;


 
 
 
 
c
o
n
s
t
 
o
n
 
=
 
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
t
.
f
o
l
l
o
w
e
d
P
l
a
n
 
=
=
=
 
t
r
u
e
)
;


 
 
 
 
c
o
n
s
t
 
a
g
g
 
=
 
(
l
i
s
t
:
 
T
r
a
d
e
[
]
)
 
=
>
 
{


 
 
 
 
 
 
c
o
n
s
t
 
d
e
c
i
d
e
d
 
=
 
l
i
s
t
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
!
=
=
 
"
b
e
"
)
;


 
 
 
 
 
 
r
e
t
u
r
n
 
{


 
 
 
 
 
 
 
 
n
:
 
l
i
s
t
.
l
e
n
g
t
h
,


 
 
 
 
 
 
 
 
w
r
:
 
d
e
c
i
d
e
d
.
l
e
n
g
t
h
 
?
 
(
d
e
c
i
d
e
d
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
=
=
=
 
"
w
i
n
"
)
.
l
e
n
g
t
h
 
/
 
d
e
c
i
d
e
d
.
l
e
n
g
t
h
)
 
*
 
1
0
0
 
:
 
0
,


 
 
 
 
 
 
 
 
r
:
 
l
i
s
t
.
r
e
d
u
c
e
(
(
a
,
 
t
)
 
=
>
 
a
 
+
 
t
.
r
r
,
 
0
)
,


 
 
 
 
 
 
 
 
e
x
p
:
 
l
i
s
t
.
l
e
n
g
t
h
 
?
 
l
i
s
t
.
r
e
d
u
c
e
(
(
a
,
 
t
)
 
=
>
 
a
 
+
 
t
.
r
r
,
 
0
)
 
/
 
l
i
s
t
.
l
e
n
g
t
h
 
:
 
0
,


 
 
 
 
 
 
 
 
p
n
l
:
 
l
i
s
t
.
r
e
d
u
c
e
(
(
a
,
 
t
)
 
=
>
 
a
 
+
 
t
.
p
n
l
,
 
0
)
,


 
 
 
 
 
 
}
;


 
 
 
 
}
;


 
 
 
 
r
e
t
u
r
n
 
{
 
o
n
:
 
a
g
g
(
o
n
)
,
 
o
f
f
:
 
a
g
g
(
o
f
f
)
 
}
;


 
 
}
,
 
[
t
r
a
d
e
s
]
)
;




 
 
i
f
 
(
m
.
o
f
f
.
n
 
=
=
=
 
0
 
&
&
 
m
.
o
n
.
n
 
=
=
=
 
0
)
 
r
e
t
u
r
n
 
n
u
l
l
;




 
 
c
o
n
s
t
 
R
o
w
 
=
 
(
{
 
l
a
b
e
l
,
 
o
n
,
 
o
f
f
 
}
:
 
{
 
l
a
b
e
l
:
 
s
t
r
i
n
g
;
 
o
n
:
 
s
t
r
i
n
g
;
 
o
f
f
:
 
s
t
r
i
n
g
 
}
)
 
=
>
 
(


 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
3
 
i
t
e
m
s
-
c
e
n
t
e
r
 
p
y
-
1
.
5
 
t
e
x
t
-
s
m
"
>


 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
m
u
t
e
"
>
{
l
a
b
e
l
}
<
/
s
p
a
n
>


 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
r
i
g
h
t
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
p
o
s
"
>
{
o
n
}
<
/
s
p
a
n
>


 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
r
i
g
h
t
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
w
a
r
n
"
>
{
o
f
f
}
<
/
s
p
a
n
>


 
 
 
 
<
/
d
i
v
>


 
 
)
;




 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
l
a
n
 
v
s
 
o
f
f
-
p
l
a
n
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
3
 
b
o
r
d
e
r
-
b
 
b
o
r
d
e
r
-
e
d
g
e
 
p
b
-
2
 
t
e
x
t
-
x
s
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
<
s
p
a
n
 
/
>


 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
r
i
g
h
t
 
t
e
x
t
-
p
o
s
"
>
F
o
l
l
o
w
e
d
 
p
l
a
n
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
r
i
g
h
t
 
t
e
x
t
-
w
a
r
n
"
>
O
f
f
-
p
l
a
n
<
/
s
p
a
n
>


 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
d
i
v
i
d
e
-
y
 
d
i
v
i
d
e
-
e
d
g
e
/
6
0
"
>


 
 
 
 
 
 
 
 
<
R
o
w
 
l
a
b
e
l
=
"
T
r
a
d
e
s
"
 
o
n
=
{
S
t
r
i
n
g
(
m
.
o
n
.
n
)
}
 
o
f
f
=
{
S
t
r
i
n
g
(
m
.
o
f
f
.
n
)
}
 
/
>


 
 
 
 
 
 
 
 
<
R
o
w
 
l
a
b
e
l
=
"
W
i
n
 
r
a
t
e
"
 
o
n
=
{
`
$
{
m
.
o
n
.
w
r
.
t
o
F
i
x
e
d
(
0
)
}
%
`
}
 
o
f
f
=
{
`
$
{
m
.
o
f
f
.
w
r
.
t
o
F
i
x
e
d
(
0
)
}
%
`
}
 
/
>


 
 
 
 
 
 
 
 
<
R
o
w
 
l
a
b
e
l
=
"
E
x
p
e
c
t
a
n
c
y
"
 
o
n
=
{
`
$
{
m
.
o
n
.
e
x
p
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}
 
o
f
f
=
{
`
$
{
m
.
o
f
f
.
e
x
p
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}
 
/
>


 
 
 
 
 
 
 
 
<
R
o
w
 
l
a
b
e
l
=
"
T
o
t
a
l
 
R
"
 
o
n
=
{
`
$
{
m
.
o
n
.
r
 
>
=
 
0
 
?
 
"
+
"
 
:
 
"
"
}
$
{
m
.
o
n
.
r
.
t
o
F
i
x
e
d
(
1
)
}
R
`
}
 
o
f
f
=
{
`
$
{
m
.
o
f
f
.
r
 
>
=
 
0
 
?
 
"
+
"
 
:
 
"
"
}
$
{
m
.
o
f
f
.
r
.
t
o
F
i
x
e
d
(
1
)
}
R
`
}
 
/
>


 
 
 
 
 
 
 
 
<
R
o
w
 
l
a
b
e
l
=
"
P
&
L
"
 
o
n
=
{
f
m
t
M
o
n
e
y
(
m
.
o
n
.
p
n
l
,
 
c
u
r
r
e
n
c
y
)
}
 
o
f
f
=
{
f
m
t
M
o
n
e
y
(
m
.
o
f
f
.
p
n
l
,
 
c
u
r
r
e
n
c
y
)
}
 
/
>


 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
{
m
.
o
f
f
.
n
 
>
 
0
 
&
&
 
m
.
o
n
.
n
 
>
 
0
 
&
&
 
(


 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
3
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
{
m
.
o
f
f
.
e
x
p
 
<
 
m
.
o
n
.
e
x
p


 
 
 
 
 
 
 
 
 
 
 
 
?
 
`
O
f
f
-
p
l
a
n
 
t
r
a
d
e
s
 
c
o
s
t
 
y
o
u
 
$
{
(
m
.
o
n
.
e
x
p
 
-
 
m
.
o
f
f
.
e
x
p
)
.
t
o
F
i
x
e
d
(
2
)
}
R
 
p
e
r
 
t
r
a
d
e
 
v
e
r
s
u
s
 
y
o
u
r
 
o
w
n
 
s
y
s
t
e
m
.
 
E
l
i
m
i
n
a
t
i
n
g
 
t
h
e
m
 
i
s
 
w
o
r
t
h
 
m
o
r
e
 
t
h
a
n
 
a
n
y
 
n
e
w
 
s
e
t
u
p
.
`


 
 
 
 
 
 
 
 
 
 
 
 
:
 
"
O
f
f
-
p
l
a
n
 
t
r
a
d
e
s
 
a
r
e
 
o
u
t
p
e
r
f
o
r
m
i
n
g
 
y
o
u
r
 
p
l
a
n
 
h
e
r
e
 
—
 
w
o
r
t
h
 
e
x
a
m
i
n
i
n
g
 
w
h
e
t
h
e
r
 
t
h
e
 
p
l
a
n
 
i
s
 
t
o
o
 
r
e
s
t
r
i
c
t
i
v
e
,
 
o
r
 
t
h
i
s
 
i
s
 
a
 
s
m
a
l
l
-
s
a
m
p
l
e
 
f
l
u
k
e
.
"
}


 
 
 
 
 
 
 
 
<
/
p
>


 
 
 
 
 
 
)
}


 
 
 
 
<
/
C
a
r
d
>


 
 
)
;


}




t
y
p
e
 
C
o
u
n
t
M
o
d
e
 
=
 
"
B
y
 
s
e
t
u
p
"
 
|
 
"
B
y
 
e
x
e
c
u
t
i
o
n
"
;




e
x
p
o
r
t
 
d
e
f
a
u
l
t
 
f
u
n
c
t
i
o
n
 
A
n
a
l
y
t
i
c
s
P
a
g
e
(
)
 
{


 
 
c
o
n
s
t
 
[
c
o
u
n
t
M
o
d
e
,
 
s
e
t
C
o
u
n
t
M
o
d
e
]
 
=
 
u
s
e
S
t
a
t
e
<
C
o
u
n
t
M
o
d
e
>
(
"
B
y
 
s
e
t
u
p
"
)
;


 
 
c
o
n
s
t
 
[
c
u
r
v
e
M
o
d
e
,
 
s
e
t
C
u
r
v
e
M
o
d
e
]
 
=
 
u
s
e
S
t
a
t
e
<
"
M
o
n
e
y
"
 
|
 
"
R
"
>
(
"
M
o
n
e
y
"
)
;


 
 
/
*
*
 
C
h
a
l
l
e
n
g
e
 
m
o
n
e
y
 
i
s
 
n
o
t
i
o
n
a
l
;
 
f
u
n
d
e
d
 
m
o
n
e
y
 
i
s
 
r
e
a
l
.
 
N
e
v
e
r
 
b
l
e
n
d
 
t
h
e
m
.
 
*
/


 
 
c
o
n
s
t
 
[
s
t
a
g
e
,
 
s
e
t
S
t
a
g
e
]
 
=
 
u
s
e
S
t
a
t
e
<
C
a
p
i
t
a
l
S
t
a
g
e
>
(
"
a
l
l
"
)
;


 
 
/
*
*
 
W
h
i
c
h
 
b
o
o
k
 
t
o
 
a
n
a
l
y
s
e
.
 
B
a
c
k
t
e
s
t
s
 
a
n
d
 
f
o
r
w
a
r
d
 
t
e
s
t
s
 
g
e
t
 
t
h
e
 
s
a
m
e
 
t
o
o
l
i
n
g
 
a
s


 
 
 
*
 
 
l
i
v
e
,
 
b
u
t
 
s
t
a
y
 
s
t
r
i
c
t
l
y
 
s
e
p
a
r
a
t
e
 
—
 
n
e
v
e
r
 
b
l
e
n
d
e
d
 
i
n
t
o
 
l
i
v
e
 
p
e
r
f
o
r
m
a
n
c
e
.
 
*
/


 
 
c
o
n
s
t
 
[
d
a
t
a
s
e
t
,
 
s
e
t
D
a
t
a
s
e
t
]
 
=
 
u
s
e
S
t
a
t
e
<
"
l
i
v
e
"
 
|
 
"
b
a
c
k
t
e
s
t
"
 
|
 
"
f
o
r
w
a
r
d
"
>
(
"
l
i
v
e
"
)
;


 
 
c
o
n
s
t
 
[
f
T
y
p
e
,
 
s
e
t
F
T
y
p
e
]
 
=
 
u
s
e
S
t
a
t
e
<
s
t
r
i
n
g
>
(
"
"
)
;


 
 
c
o
n
s
t
 
a
l
l
A
c
c
o
u
n
t
s
 
=
 
u
s
e
A
p
p
(
(
s
)
 
=
>
 
s
.
a
c
c
o
u
n
t
s
)
;


 
 
c
o
n
s
t
 
a
l
l
T
r
a
d
e
s
R
a
w
 
=
 
u
s
e
A
p
p
(
(
s
)
 
=
>
 
s
.
t
r
a
d
e
s
)
;


 
 
/
*
*
 
T
r
u
e
 
w
h
e
n
 
l
i
v
e
 
t
r
a
d
e
s
 
e
x
i
s
t
 
o
n
 
b
o
t
h
 
c
h
a
l
l
e
n
g
e
 
a
n
d
 
f
u
n
d
e
d
 
a
c
c
o
u
n
t
s
.
 
*
/


 
 
/
*
*
 
L
i
v
e
 
t
r
a
d
e
 
c
o
u
n
t
s
 
p
e
r
 
s
t
a
g
e
,
 
s
h
o
w
n
 
o
n
 
t
h
e
 
p
i
l
l
s
 
s
o
 
a
 
d
i
f
f
e
r
i
n
g
 
h
e
a
d
l
i
n
e


 
 
 
*
 
 
c
o
u
n
t
 
r
e
a
d
s
 
a
s
 
s
c
o
p
e
 
r
a
t
h
e
r
 
t
h
a
n
 
a
 
b
u
g
.
 
*
/


 
 
c
o
n
s
t
 
d
a
t
a
s
e
t
C
o
u
n
t
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
c
 
=
 
{
 
l
i
v
e
:
 
0
,
 
b
a
c
k
t
e
s
t
:
 
0
,
 
f
o
r
w
a
r
d
:
 
0
 
}
 
a
s
 
R
e
c
o
r
d
<
"
l
i
v
e
"
 
|
 
"
b
a
c
k
t
e
s
t
"
 
|
 
"
f
o
r
w
a
r
d
"
,
 
n
u
m
b
e
r
>
;


 
 
 
 
f
o
r
 
(
c
o
n
s
t
 
t
 
o
f
 
a
l
l
T
r
a
d
e
s
R
a
w
)
 
i
f
 
(
c
[
t
.
t
y
p
e
]
 
!
=
=
 
u
n
d
e
f
i
n
e
d
)
 
c
[
t
.
t
y
p
e
]
+
+
;


 
 
 
 
r
e
t
u
r
n
 
c
;


 
 
}
,
 
[
a
l
l
T
r
a
d
e
s
R
a
w
]
)
;


 
 
c
o
n
s
t
 
s
t
a
g
e
C
o
u
n
t
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
c
:
 
R
e
c
o
r
d
<
C
a
p
i
t
a
l
S
t
a
g
e
,
 
n
u
m
b
e
r
>
 
=
 
{
 
a
l
l
:
 
0
,
 
f
u
n
d
e
d
:
 
0
,
 
c
h
a
l
l
e
n
g
e
:
 
0
 
}
;


 
 
 
 
f
o
r
 
(
c
o
n
s
t
 
t
 
o
f
 
a
l
l
T
r
a
d
e
s
R
a
w
)
 
{


 
 
 
 
 
 
i
f
 
(
t
.
t
y
p
e
 
!
=
=
 
"
l
i
v
e
"
)
 
c
o
n
t
i
n
u
e
;


 
 
 
 
 
 
c
o
n
s
t
 
a
c
c
t
 
=
 
a
l
l
A
c
c
o
u
n
t
s
.
f
i
n
d
(
(
a
)
 
=
>
 
a
.
i
d
 
=
=
=
 
t
.
a
c
c
o
u
n
t
I
d
 
&
&
 
!
a
.
a
r
c
h
i
v
e
d
)
;


 
 
 
 
 
 
i
f
 
(
!
a
c
c
t
)
 
c
o
n
t
i
n
u
e
;


 
 
 
 
 
 
c
.
a
l
l
+
+
;


 
 
 
 
 
 
c
o
n
s
t
 
s
t
 
=
 
s
t
a
g
e
O
f
(
a
c
c
t
.
t
y
p
e
)
;


 
 
 
 
 
 
i
f
 
(
s
t
 
=
=
=
 
"
f
u
n
d
e
d
"
)
 
c
.
f
u
n
d
e
d
+
+
;


 
 
 
 
 
 
e
l
s
e
 
i
f
 
(
s
t
 
=
=
=
 
"
c
h
a
l
l
e
n
g
e
"
)
 
c
.
c
h
a
l
l
e
n
g
e
+
+
;


 
 
 
 
}


 
 
 
 
r
e
t
u
r
n
 
c
;


 
 
}
,
 
[
a
l
l
T
r
a
d
e
s
R
a
w
,
 
a
l
l
A
c
c
o
u
n
t
s
]
)
;


 
 
c
o
n
s
t
 
a
l
l
L
i
v
e
C
o
u
n
t
 
=
 
u
s
e
M
e
m
o
(


 
 
 
 
(
)
 
=
>
 
a
l
l
T
r
a
d
e
s
R
a
w
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
t
.
t
y
p
e
 
=
=
=
 
d
a
t
a
s
e
t
)
.
l
e
n
g
t
h
,


 
 
 
 
[
a
l
l
T
r
a
d
e
s
R
a
w
,
 
d
a
t
a
s
e
t
]


 
 
)
;


 
 
c
o
n
s
t
 
m
i
x
e
d
S
t
a
g
e
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
s
t
a
g
e
s
 
=
 
n
e
w
 
S
e
t
<
s
t
r
i
n
g
>
(
)
;


 
 
 
 
f
o
r
 
(
c
o
n
s
t
 
t
 
o
f
 
a
l
l
T
r
a
d
e
s
R
a
w
)
 
{


 
 
 
 
 
 
i
f
 
(
t
.
t
y
p
e
 
!
=
=
 
"
l
i
v
e
"
)
 
c
o
n
t
i
n
u
e
;


 
 
 
 
 
 
c
o
n
s
t
 
a
c
c
t
 
=
 
a
l
l
A
c
c
o
u
n
t
s
.
f
i
n
d
(
(
a
)
 
=
>
 
a
.
i
d
 
=
=
=
 
t
.
a
c
c
o
u
n
t
I
d
 
&
&
 
!
a
.
a
r
c
h
i
v
e
d
)
;


 
 
 
 
 
 
i
f
 
(
!
a
c
c
t
)
 
c
o
n
t
i
n
u
e
;


 
 
 
 
 
 
c
o
n
s
t
 
s
t
 
=
 
s
t
a
g
e
O
f
(
a
c
c
t
.
t
y
p
e
)
;


 
 
 
 
 
 
i
f
 
(
s
t
 
=
=
=
 
"
f
u
n
d
e
d
"
 
|
|
 
s
t
 
=
=
=
 
"
c
h
a
l
l
e
n
g
e
"
)
 
s
t
a
g
e
s
.
a
d
d
(
s
t
)
;


 
 
 
 
}


 
 
 
 
r
e
t
u
r
n
 
s
t
a
g
e
s
.
s
i
z
e
 
>
 
1
;


 
 
}
,
 
[
a
l
l
T
r
a
d
e
s
R
a
w
,
 
a
l
l
A
c
c
o
u
n
t
s
]
)
;


 
 
/
/
 
C
h
a
l
l
e
n
g
e
 
P
&
L
 
i
s
 
s
c
o
r
e
,
 
f
u
n
d
e
d
 
P
&
L
 
i
s
 
i
n
c
o
m
e
.
 
D
e
f
a
u
l
t
 
t
o
 
r
e
a
l
 
m
o
n
e
y
 
s
o
 
t
h
e


 
 
/
/
 
d
o
l
l
a
r
 
f
i
g
u
r
e
s
 
o
n
 
t
h
i
s
 
p
a
g
e
 
a
l
w
a
y
s
 
m
e
a
n
 
w
i
t
h
d
r
a
w
a
b
l
e
 
p
r
o
f
i
t
.


 
 
/
/
 
C
a
p
i
t
a
l
 
s
c
o
p
e
 
l
i
v
e
s
 
i
n
 
o
n
e
 
p
l
a
c
e
:
 
t
h
e
 
s
t
a
g
e
 
p
i
l
l
s
.
 
A
 
s
e
c
o
n
d
 
M
o
n
e
y
 
f
i
l
t
e
r


 
 
/
/
 
u
s
e
d
 
t
o
 
s
t
a
c
k
 
o
n
 
t
o
p
 
o
f
 
t
h
i
s
 
a
n
d
 
c
o
u
l
d
 
c
o
n
t
r
a
d
i
c
t
 
i
t
 
(
C
h
a
l
l
e
n
g
e
 
+
 
R
e
a
l


 
 
/
/
 
m
o
n
e
y
 
=
 
z
e
r
o
 
t
r
a
d
e
s
,
 
w
i
t
h
 
n
o
 
i
n
d
i
c
a
t
i
o
n
 
w
h
y
)
.


 
 
c
o
n
s
t
 
m
o
n
e
y
S
c
o
p
e
:
 
M
o
n
e
y
S
c
o
p
e
 
=


 
 
 
 
s
t
a
g
e
 
=
=
=
 
"
f
u
n
d
e
d
"
 
?
 
"
R
e
a
l
 
m
o
n
e
y
"
 
:
 
s
t
a
g
e
 
=
=
=
 
"
c
h
a
l
l
e
n
g
e
"
 
?
 
"
C
h
a
l
l
e
n
g
e
"
 
:
 
"
A
l
l
"
;


 
 
c
o
n
s
t
 
a
c
c
o
u
n
t
s
 
=
 
u
s
e
A
p
p
(
(
s
)
 
=
>
 
s
.
a
c
c
o
u
n
t
s
)
;


 
 
c
o
n
s
t
 
r
a
w
V
i
s
i
b
l
e
 
=
 
u
s
e
V
i
s
i
b
l
e
T
r
a
d
e
s
(
d
a
t
a
s
e
t
,
 
d
a
t
a
s
e
t
 
=
=
=
 
"
l
i
v
e
"
 
?
 
s
t
a
g
e
 
:
 
"
a
l
l
"
)
;


 
 
c
o
n
s
t
 
c
o
u
n
t
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
s
e
t
u
p
C
o
u
n
t
s
(
r
a
w
V
i
s
i
b
l
e
)
,
 
[
r
a
w
V
i
s
i
b
l
e
]
)
;


 
 
c
o
n
s
t
 
h
a
s
L
i
n
k
e
d
 
=
 
c
o
u
n
t
s
.
e
x
e
c
u
t
i
o
n
s
 
!
=
=
 
c
o
u
n
t
s
.
s
e
t
u
p
s
;


 
 
/
/
 
E
d
g
e
 
m
e
t
r
i
c
s
 
m
u
s
t
 
c
o
u
n
t
 
I
D
E
A
S
,
 
n
o
t
 
f
i
l
l
s
 
—
 
o
t
h
e
r
w
i
s
e
 
t
h
e
 
s
a
m
e
 
s
e
t
u
p
 
t
a
k
e
n
 
o
n


 
 
/
/
 
3
 
a
c
c
o
u
n
t
s
 
i
n
f
l
a
t
e
s
 
t
h
e
 
s
a
m
p
l
e
 
3
x
 
a
n
d
 
o
v
e
r
s
t
a
t
e
s
 
c
o
n
f
i
d
e
n
c
e
 
i
n
 
t
h
e
 
e
d
g
e
.


 
 
c
o
n
s
t
 
s
c
o
p
e
d
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
f
i
l
t
e
r
B
y
M
o
n
e
y
S
c
o
p
e
(
r
a
w
V
i
s
i
b
l
e
,
 
a
c
c
o
u
n
t
s
,
 
m
o
n
e
y
S
c
o
p
e
)
,
 
[
r
a
w
V
i
s
i
b
l
e
,
 
a
c
c
o
u
n
t
s
,
 
m
o
n
e
y
S
c
o
p
e
]
)
;


 
 
c
o
n
s
t
 
s
p
l
i
t
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
m
o
n
e
y
S
p
l
i
t
(
r
a
w
V
i
s
i
b
l
e
,
 
a
c
c
o
u
n
t
s
)
,
 
[
r
a
w
V
i
s
i
b
l
e
,
 
a
c
c
o
u
n
t
s
]
)
;


 
 
c
o
n
s
t
 
v
i
s
i
b
l
e
 
=
 
u
s
e
M
e
m
o
(


 
 
 
 
(
)
 
=
>
 
(
c
o
u
n
t
M
o
d
e
 
=
=
=
 
"
B
y
 
s
e
t
u
p
"
 
?
 
d
e
d
u
p
e
B
y
S
e
t
u
p
(
s
c
o
p
e
d
)
 
:
 
s
c
o
p
e
d
)
,


 
 
 
 
[
s
c
o
p
e
d
,
 
c
o
u
n
t
M
o
d
e
]


 
 
)
;


 
 
c
o
n
s
t
 
c
u
r
r
e
n
c
y
 
=
 
u
s
e
D
i
s
p
l
a
y
C
u
r
r
e
n
c
y
(
)
;


 
 
c
o
n
s
t
 
s
t
r
a
t
e
g
i
e
s
 
=
 
u
s
e
A
p
p
(
(
s
)
 
=
>
 
s
.
s
t
r
a
t
e
g
i
e
s
)
;


 
 
c
o
n
s
t
 
[
t
a
b
,
 
s
e
t
T
a
b
]
 
=
 
u
s
e
S
t
a
t
e
(
"
O
v
e
r
v
i
e
w
"
)
;


 
 
c
o
n
s
t
 
[
c
o
m
b
o
S
i
z
e
,
 
s
e
t
C
o
m
b
o
S
i
z
e
]
 
=
 
u
s
e
S
t
a
t
e
(
"
A
l
l
"
)
;




 
 
/
/
 
H
o
r
i
z
o
n
t
a
l
 
f
i
l
t
e
r
 
b
a
r
 
—
 
a
p
p
l
i
e
s
 
t
o
 
e
v
e
r
y
 
t
a
b
.


 
 
c
o
n
s
t
 
[
f
R
a
n
g
e
,
 
s
e
t
F
R
a
n
g
e
]
 
=
 
u
s
e
S
t
a
t
e
(
"
a
l
l
"
)
;


 
 
c
o
n
s
t
 
[
f
S
t
r
a
t
e
g
y
,
 
s
e
t
F
S
t
r
a
t
e
g
y
]
 
=
 
u
s
e
S
t
a
t
e
(
"
"
)
;


 
 
c
o
n
s
t
 
[
f
S
e
s
s
i
o
n
,
 
s
e
t
F
S
e
s
s
i
o
n
]
 
=
 
u
s
e
S
t
a
t
e
(
"
"
)
;


 
 
c
o
n
s
t
 
[
f
S
i
d
e
,
 
s
e
t
F
S
i
d
e
]
 
=
 
u
s
e
S
t
a
t
e
(
"
"
)
;


 
 
c
o
n
s
t
 
[
f
O
u
t
c
o
m
e
,
 
s
e
t
F
O
u
t
c
o
m
e
]
 
=
 
u
s
e
S
t
a
t
e
(
"
"
)
;




 
 
c
o
n
s
t
 
t
r
a
d
e
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
d
a
y
s
 
=
 
f
R
a
n
g
e
 
=
=
=
 
"
a
l
l
"
 
?
 
I
n
f
i
n
i
t
y
 
:
 
p
a
r
s
e
I
n
t
(
f
R
a
n
g
e
,
 
1
0
)
;


 
 
 
 
c
o
n
s
t
 
c
u
t
o
f
f
 
=
 
d
a
y
s
 
=
=
=
 
I
n
f
i
n
i
t
y
 
?
 
-
I
n
f
i
n
i
t
y
 
:
 
D
a
t
e
.
n
o
w
(
)
 
-
 
d
a
y
s
 
*
 
8
6
4
0
0
0
0
0
;


 
 
 
 
r
e
t
u
r
n
 
v
i
s
i
b
l
e
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
{


 
 
 
 
 
 
i
f
 
(
f
S
t
r
a
t
e
g
y
 
&
&
 
t
.
s
t
r
a
t
e
g
y
I
d
 
!
=
=
 
f
S
t
r
a
t
e
g
y
)
 
r
e
t
u
r
n
 
f
a
l
s
e
;


 
 
 
 
 
 
i
f
 
(
f
S
e
s
s
i
o
n
 
&
&
 
t
.
s
e
s
s
i
o
n
 
!
=
=
 
f
S
e
s
s
i
o
n
)
 
r
e
t
u
r
n
 
f
a
l
s
e
;


 
 
 
 
 
 
i
f
 
(
f
S
i
d
e
 
&
&
 
t
.
d
i
r
e
c
t
i
o
n
 
!
=
=
 
f
S
i
d
e
)
 
r
e
t
u
r
n
 
f
a
l
s
e
;


 
 
 
 
 
 
i
f
 
(
f
O
u
t
c
o
m
e
 
&
&
 
o
u
t
c
o
m
e
O
f
(
t
)
 
!
=
=
 
f
O
u
t
c
o
m
e
)
 
r
e
t
u
r
n
 
f
a
l
s
e
;


 
 
 
 
 
 
i
f
 
(
f
T
y
p
e
 
&
&
 
q
u
a
d
r
a
n
t
O
f
(
t
)
 
!
=
=
 
f
T
y
p
e
)
 
r
e
t
u
r
n
 
f
a
l
s
e
;


 
 
 
 
 
 
i
f
 
(
n
e
w
 
D
a
t
e
(
t
.
d
a
t
e
)
.
g
e
t
T
i
m
e
(
)
 
<
 
c
u
t
o
f
f
)
 
r
e
t
u
r
n
 
f
a
l
s
e
;


 
 
 
 
 
 
r
e
t
u
r
n
 
t
r
u
e
;


 
 
 
 
}
)
;


 
 
}
,
 
[
v
i
s
i
b
l
e
,
 
f
R
a
n
g
e
,
 
f
S
t
r
a
t
e
g
y
,
 
f
S
e
s
s
i
o
n
,
 
f
S
i
d
e
,
 
f
O
u
t
c
o
m
e
,
 
f
T
y
p
e
]
)
;




 
 
c
o
n
s
t
 
s
t
a
t
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
c
o
m
p
u
t
e
S
t
a
t
s
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
/
*
*
 
R
u
n
n
i
n
g
 
s
e
r
i
e
s
 
+
 
a
v
e
r
a
g
e
s
 
p
o
w
e
r
i
n
g
 
t
h
e
 
R
R
 
s
t
r
i
p
.
 
*
/


 
 
c
o
n
s
t
 
p
l
a
n
n
e
d
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
a
v
g
P
l
a
n
n
e
d
R
R
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
b
e
M
i
s
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
b
r
e
a
k
e
v
e
n
M
i
s
s
e
s
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
{
 
r
r
S
e
r
i
e
s
,
 
w
i
n
S
e
r
i
e
s
,
 
a
v
g
W
i
n
R
,
 
a
v
g
L
o
s
s
R
 
}
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
o
r
d
e
r
e
d
 
=
 
[
.
.
.
t
r
a
d
e
s
]
.
s
o
r
t
(
(
a
,
 
b
)
 
=
>
 
a
.
d
a
t
e
.
l
o
c
a
l
e
C
o
m
p
a
r
e
(
b
.
d
a
t
e
)
)
;


 
 
 
 
c
o
n
s
t
 
r
r
S
e
r
i
e
s
:
 
n
u
m
b
e
r
[
]
 
=
 
[
]
;


 
 
 
 
l
e
t
 
s
u
m
 
=
 
0
;


 
 
 
 
o
r
d
e
r
e
d
.
f
o
r
E
a
c
h
(
(
t
,
 
i
)
 
=
>
 
{
 
s
u
m
 
+
=
 
t
.
r
r
;
 
r
r
S
e
r
i
e
s
.
p
u
s
h
(
s
u
m
 
/
 
(
i
 
+
 
1
)
)
;
 
}
)
;


 
 
 
 
c
o
n
s
t
 
w
i
n
s
 
=
 
o
r
d
e
r
e
d
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
=
=
=
 
"
w
i
n
"
)
;


 
 
 
 
c
o
n
s
t
 
l
o
s
s
e
s
 
=
 
o
r
d
e
r
e
d
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
=
=
=
 
"
l
o
s
s
"
)
;


 
 
 
 
c
o
n
s
t
 
a
v
g
W
i
n
R
 
=
 
w
i
n
s
.
l
e
n
g
t
h
 
?
 
w
i
n
s
.
r
e
d
u
c
e
(
(
a
,
 
t
)
 
=
>
 
a
 
+
 
M
a
t
h
.
a
b
s
(
t
.
r
r
)
,
 
0
)
 
/
 
w
i
n
s
.
l
e
n
g
t
h
 
:
 
0
;


 
 
 
 
c
o
n
s
t
 
a
v
g
L
o
s
s
R
 
=
 
l
o
s
s
e
s
.
l
e
n
g
t
h
 
?
 
l
o
s
s
e
s
.
r
e
d
u
c
e
(
(
a
,
 
t
)
 
=
>
 
a
 
+
 
M
a
t
h
.
a
b
s
(
t
.
r
r
)
,
 
0
)
 
/
 
l
o
s
s
e
s
.
l
e
n
g
t
h
 
:
 
1
;


 
 
 
 
l
e
t
 
w
s
 
=
 
0
;


 
 
 
 
c
o
n
s
t
 
w
i
n
S
e
r
i
e
s
 
=
 
w
i
n
s
.
m
a
p
(
(
t
,
 
i
)
 
=
>
 
{
 
w
s
 
+
=
 
M
a
t
h
.
a
b
s
(
t
.
r
r
)
;
 
r
e
t
u
r
n
 
w
s
 
/
 
(
i
 
+
 
1
)
;
 
}
)
;


 
 
 
 
r
e
t
u
r
n
 
{
 
r
r
S
e
r
i
e
s
,
 
w
i
n
S
e
r
i
e
s
,
 
a
v
g
W
i
n
R
,
 
a
v
g
L
o
s
s
R
 
}
;


 
 
}
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
c
u
r
v
e
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
e
q
u
i
t
y
C
u
r
v
e
(
t
r
a
d
e
s
,
 
c
u
r
v
e
M
o
d
e
 
=
=
=
 
"
R
"
 
?
 
"
r
r
"
 
:
 
"
p
n
l
"
)
,
 
[
t
r
a
d
e
s
,
 
c
u
r
v
e
M
o
d
e
]
)
;


 
 
c
o
n
s
t
 
w
l
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
w
i
n
L
o
s
s
S
u
m
m
a
r
y
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
e
x
p
e
c
t
a
n
c
y
M
o
n
e
y
 
=
 
u
s
e
M
e
m
o
(


 
 
 
 
(
)
 
=
>
 
(
t
r
a
d
e
s
.
l
e
n
g
t
h
 
?
 
t
r
a
d
e
s
.
r
e
d
u
c
e
(
(
a
,
 
t
)
 
=
>
 
a
 
+
 
t
.
p
n
l
,
 
0
)
 
/
 
t
r
a
d
e
s
.
l
e
n
g
t
h
 
:
 
0
)
,


 
 
 
 
[
t
r
a
d
e
s
]


 
 
)
;


 
 
c
o
n
s
t
 
g
r
o
s
s
S
p
l
i
t
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
t
o
t
a
l
 
=
 
w
l
.
g
r
o
s
s
W
i
n
P
n
l
 
-
 
w
l
.
g
r
o
s
s
L
o
s
s
P
n
l
;


 
 
 
 
r
e
t
u
r
n
 
t
o
t
a
l
 
>
 
0
 
?
 
(
w
l
.
g
r
o
s
s
W
i
n
P
n
l
 
/
 
t
o
t
a
l
)
 
*
 
1
0
0
 
:
 
5
0
;


 
 
}
,
 
[
w
l
]
)
;


 
 
/
*
*
 
L
o
n
g
/
s
h
o
r
t
 
c
o
u
n
t
s
 
a
n
d
 
w
i
n
 
r
a
t
e
s
,
 
s
h
a
r
e
d
 
b
y
 
t
h
e
 
b
y
-
s
i
d
e
 
v
i
s
u
a
l
s
.
 
*
/


 
 
c
o
n
s
t
 
s
i
d
e
S
p
l
i
t
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
w
r
 
=
 
(
l
i
s
t
:
 
t
y
p
e
o
f
 
t
r
a
d
e
s
)
 
=
>
 
{


 
 
 
 
 
 
c
o
n
s
t
 
d
e
c
i
d
e
d
 
=
 
l
i
s
t
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
!
=
=
 
"
b
e
"
)
;


 
 
 
 
 
 
r
e
t
u
r
n
 
d
e
c
i
d
e
d
.
l
e
n
g
t
h
 
?
 
(
d
e
c
i
d
e
d
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
=
=
=
 
"
w
i
n
"
)
.
l
e
n
g
t
h
 
/
 
d
e
c
i
d
e
d
.
l
e
n
g
t
h
)
 
*
 
1
0
0
 
:
 
0
;


 
 
 
 
}
;


 
 
 
 
c
o
n
s
t
 
l
o
n
g
s
 
=
 
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
t
.
d
i
r
e
c
t
i
o
n
 
=
=
=
 
"
l
o
n
g
"
)
;


 
 
 
 
c
o
n
s
t
 
s
h
o
r
t
s
 
=
 
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
t
.
d
i
r
e
c
t
i
o
n
 
=
=
=
 
"
s
h
o
r
t
"
)
;


 
 
 
 
r
e
t
u
r
n
 
{
 
l
o
n
g
N
:
 
l
o
n
g
s
.
l
e
n
g
t
h
,
 
s
h
o
r
t
N
:
 
s
h
o
r
t
s
.
l
e
n
g
t
h
,
 
l
o
n
g
W
R
:
 
w
r
(
l
o
n
g
s
)
,
 
s
h
o
r
t
W
R
:
 
w
r
(
s
h
o
r
t
s
)
 
}
;


 
 
}
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
w
i
n
M
o
n
e
y
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
=
=
=
 
"
w
i
n
"
)
.
r
e
d
u
c
e
(
(
s
2
,
 
t
)
 
=
>
 
s
2
 
+
 
t
.
p
n
l
,
 
0
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
l
o
s
s
M
o
n
e
y
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
o
u
t
c
o
m
e
O
f
(
t
)
 
=
=
=
 
"
l
o
s
s
"
)
.
r
e
d
u
c
e
(
(
s
2
,
 
t
)
 
=
>
 
s
2
 
+
 
t
.
p
n
l
,
 
0
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
/
/
 
O
n
l
y
 
a
c
c
o
u
n
t
s
 
i
n
 
t
h
e
 
s
e
l
e
c
t
e
d
 
c
a
p
i
t
a
l
 
s
t
a
g
e
 
c
o
u
n
t
 
—
 
s
h
o
w
i
n
g
 
f
u
n
d
e
d


 
 
 
 
/
/
 
a
n
a
l
y
t
i
c
s
 
a
g
a
i
n
s
t
 
c
o
m
b
i
n
e
d
 
f
u
n
d
e
d
+
c
h
a
l
l
e
n
g
e
 
c
a
p
i
t
a
l
 
i
s
 
m
e
a
n
i
n
g
l
e
s
s
.


 
 
 
 
c
o
n
s
t
 
a
c
t
i
v
e
 
=
 
a
c
c
o
u
n
t
s
.
f
i
l
t
e
r
(
(
a
)
 
=
>
 
!
a
.
a
r
c
h
i
v
e
d
 
&
&
 
(
s
t
a
g
e
 
=
=
=
 
"
a
l
l
"
 
|
|
 
s
t
a
g
e
O
f
(
a
.
t
y
p
e
)
 
=
=
=
 
s
t
a
g
e
)
)
;


 
 
 
 
i
f
 
(
f
S
t
r
a
t
e
g
y
 
=
=
=
 
"
"
 
&
&
 
f
S
e
s
s
i
o
n
 
=
=
=
 
"
"
 
&
&
 
f
S
i
d
e
 
=
=
=
 
"
"
 
&
&
 
f
O
u
t
c
o
m
e
 
=
=
=
 
"
"
)
 
{


 
 
 
 
 
 
c
o
n
s
t
 
s
e
l
 
=
 
u
s
e
A
p
p
.
g
e
t
S
t
a
t
e
(
)
.
s
e
l
e
c
t
e
d
A
c
c
o
u
n
t
I
d
;


 
 
 
 
 
 
i
f
 
(
s
e
l
 
!
=
=
 
"
a
l
l
"
)
 
{


 
 
 
 
 
 
 
 
c
o
n
s
t
 
a
c
c
t
 
=
 
a
c
c
o
u
n
t
s
.
f
i
n
d
(
(
a
)
 
=
>
 
a
.
i
d
 
=
=
=
 
s
e
l
)
;


 
 
 
 
 
 
 
 
i
f
 
(
!
a
c
c
t
)
 
r
e
t
u
r
n
 
u
n
d
e
f
i
n
e
d
;


 
 
 
 
 
 
 
 
r
e
t
u
r
n
 
s
t
a
g
e
 
=
=
=
 
"
a
l
l
"
 
|
|
 
s
t
a
g
e
O
f
(
a
c
c
t
.
t
y
p
e
)
 
=
=
=
 
s
t
a
g
e
 
?
 
a
c
c
t
.
b
a
l
a
n
c
e
 
:
 
u
n
d
e
f
i
n
e
d
;


 
 
 
 
 
 
}


 
 
 
 
 
 
r
e
t
u
r
n
 
a
c
t
i
v
e
.
r
e
d
u
c
e
(
(
s
2
,
 
a
)
 
=
>
 
s
2
 
+
 
(
a
.
b
a
l
a
n
c
e
 
|
|
 
0
)
,
 
0
)
 
|
|
 
u
n
d
e
f
i
n
e
d
;


 
 
 
 
}


 
 
 
 
r
e
t
u
r
n
 
u
n
d
e
f
i
n
e
d
;


 
 
}
,
 
[
a
c
c
o
u
n
t
s
,
 
s
t
a
g
e
,
 
f
S
t
r
a
t
e
g
y
,
 
f
S
e
s
s
i
o
n
,
 
f
S
i
d
e
,
 
f
O
u
t
c
o
m
e
,
 
f
T
y
p
e
]
)
;


 
 
/
*
*
 
A
c
c
o
u
n
t
 
b
a
l
a
n
c
e
 
a
n
d
 
i
t
s
 
%
 
c
h
a
n
g
e
,
 
f
o
r
 
t
h
e
 
c
h
a
r
t
 
h
e
a
d
e
r
.
 
*
/


 
 
c
o
n
s
t
 
b
a
l
a
n
c
e
 
=
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
!
=
=
 
u
n
d
e
f
i
n
e
d
 
?
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
+
 
s
t
a
t
s
.
n
e
t
P
n
l
 
:
 
u
n
d
e
f
i
n
e
d
;


 
 
c
o
n
s
t
 
p
c
t
C
h
a
n
g
e
 
=
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
?
 
(
s
t
a
t
s
.
n
e
t
P
n
l
 
/
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
)
 
*
 
1
0
0
 
:
 
u
n
d
e
f
i
n
e
d
;


 
 
c
o
n
s
t
 
m
o
n
t
h
l
y
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
m
o
n
t
h
l
y
P
e
r
f
o
r
m
a
n
c
e
(
t
r
a
d
e
s
,
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
)
,
 
[
t
r
a
d
e
s
,
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
]
)
;


 
 
c
o
n
s
t
 
m
o
n
t
h
l
y
C
u
r
r
e
n
c
y
 
=
 
u
s
e
D
i
s
p
l
a
y
C
u
r
r
e
n
c
y
(
)
;


 
 
c
o
n
s
t
 
b
y
S
i
d
e
 
=
 
u
s
e
M
e
m
o
(


 
 
 
 
(
)
 
=
>
 
s
t
a
t
s
B
y
G
r
o
u
p
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
(
t
.
d
i
r
e
c
t
i
o
n
 
=
=
=
 
"
l
o
n
g
"
 
?
 
"
L
o
n
g
"
 
:
 
"
S
h
o
r
t
"
)
)
,


 
 
 
 
[
t
r
a
d
e
s
]


 
 
)
;




 
 
c
o
n
s
t
 
b
y
P
a
i
r
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
s
t
a
t
s
B
y
G
r
o
u
p
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
t
.
p
a
i
r
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
b
y
S
e
s
s
i
o
n
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
s
t
a
t
s
B
y
G
r
o
u
p
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
t
.
s
e
s
s
i
o
n
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
r
a
d
a
r
P
o
i
n
t
s
 
=
 
(
p
i
c
k
:
 
(
s
t
:
 
S
t
a
t
s
)
 
=
>
 
n
u
m
b
e
r
,
 
f
m
t
:
 
(
v
:
 
n
u
m
b
e
r
)
 
=
>
 
s
t
r
i
n
g
)
 
=
>


 
 
 
 
S
E
S
S
I
O
N
S
.
m
a
p
(
(
s
)
 
=
>
 
{


 
 
 
 
 
 
c
o
n
s
t
 
r
o
w
 
=
 
b
y
S
e
s
s
i
o
n
.
f
i
n
d
(
(
r
)
 
=
>
 
r
.
k
e
y
 
=
=
=
 
s
)
;


 
 
 
 
 
 
c
o
n
s
t
 
s
t
 
=
 
r
o
w
?
.
s
t
a
t
s
;


 
 
 
 
 
 
c
o
n
s
t
 
v
a
l
u
e
 
=
 
s
t
 
?
 
p
i
c
k
(
s
t
)
 
:
 
0
;


 
 
 
 
 
 
r
e
t
u
r
n
 
{
 
s
e
s
s
i
o
n
:
 
s
,
 
v
a
l
u
e
,
 
l
a
b
e
l
:
 
f
m
t
(
v
a
l
u
e
)
,
 
t
o
t
a
l
:
 
s
t
?
.
t
o
t
a
l
 
?
?
 
0
 
}
;


 
 
 
 
}
)
;


 
 
c
o
n
s
t
 
b
y
S
t
r
a
t
e
g
y
 
=
 
u
s
e
M
e
m
o
(


 
 
 
 
(
)
 
=
>
 
s
t
a
t
s
B
y
G
r
o
u
p
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
(
t
.
s
t
r
a
t
e
g
y
I
d
 
?
 
s
t
r
a
t
e
g
i
e
s
.
f
i
n
d
(
(
s
)
 
=
>
 
s
.
i
d
 
=
=
=
 
t
.
s
t
r
a
t
e
g
y
I
d
)
?
.
n
a
m
e
 
?
?
 
"
U
n
k
n
o
w
n
"
 
:
 
"
N
o
 
s
t
r
a
t
e
g
y
"
)
)
,


 
 
 
 
[
t
r
a
d
e
s
,
 
s
t
r
a
t
e
g
i
e
s
]


 
 
)
;


 
 
c
o
n
s
t
 
b
y
A
c
c
o
u
n
t
 
=
 
u
s
e
M
e
m
o
(


 
 
 
 
(
)
 
=
>
 
s
t
a
t
s
B
y
G
r
o
u
p
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
a
c
c
o
u
n
t
s
.
f
i
n
d
(
(
a
)
 
=
>
 
a
.
i
d
 
=
=
=
 
t
.
a
c
c
o
u
n
t
I
d
)
?
.
n
a
m
e
 
?
?
 
"
U
n
k
n
o
w
n
"
)
,


 
 
 
 
[
t
r
a
d
e
s
,
 
a
c
c
o
u
n
t
s
]


 
 
)
;


 
 
c
o
n
s
t
 
c
o
m
b
o
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
t
a
g
C
o
m
b
o
s
(
t
r
a
d
e
s
,
 
2
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
f
i
l
t
e
r
e
d
C
o
m
b
o
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
i
f
 
(
c
o
m
b
o
S
i
z
e
 
=
=
=
 
"
A
l
l
"
)
 
r
e
t
u
r
n
 
c
o
m
b
o
s
.
s
l
i
c
e
(
0
,
 
4
0
)
;


 
 
 
 
c
o
n
s
t
 
n
 
=
 
c
o
m
b
o
S
i
z
e
 
=
=
=
 
"
S
i
n
g
l
e
 
t
a
g
s
"
 
?
 
1
 
:
 
c
o
m
b
o
S
i
z
e
 
=
=
=
 
"
P
a
i
r
s
 
o
f
 
t
a
g
s
"
 
?
 
2
 
:
 
3
;


 
 
 
 
r
e
t
u
r
n
 
c
o
m
b
o
s
.
f
i
l
t
e
r
(
(
c
)
 
=
>
 
c
.
k
e
y
.
s
p
l
i
t
(
"
 
+
 
"
)
.
l
e
n
g
t
h
 
=
=
=
 
n
)
.
s
l
i
c
e
(
0
,
 
4
0
)
;


 
 
}
,
 
[
c
o
m
b
o
s
,
 
c
o
m
b
o
S
i
z
e
]
)
;




 
 
c
o
n
s
t
 
b
y
G
r
a
d
e
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
o
r
d
e
r
 
=
 
n
e
w
 
M
a
p
(
G
R
A
D
E
S
.
m
a
p
(
(
g
,
 
i
)
 
=
>
 
[
g
 
a
s
 
s
t
r
i
n
g
,
 
i
]
)
)
;


 
 
 
 
r
e
t
u
r
n
 
s
t
a
t
s
B
y
G
r
o
u
p
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
t
.
g
r
a
d
e
)
.
s
o
r
t
(
(
a
,
 
b
)
 
=
>
 
(
o
r
d
e
r
.
g
e
t
(
a
.
k
e
y
)
 
?
?
 
9
)
 
-
 
(
o
r
d
e
r
.
g
e
t
(
b
.
k
e
y
)
 
?
?
 
9
)
)
;


 
 
}
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
e
x
e
c
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
e
x
e
c
u
t
i
o
n
S
u
m
m
a
r
y
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
e
x
e
c
F
i
n
d
i
n
g
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
e
x
e
c
u
t
i
o
n
F
i
n
d
i
n
g
s
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;




 
 
c
o
n
s
t
 
b
y
I
d
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
s
t
r
a
t
e
g
y
M
a
p
(
s
t
r
a
t
e
g
i
e
s
)
,
 
[
s
t
r
a
t
e
g
i
e
s
]
)
;


 
 
c
o
n
s
t
 
b
r
e
a
k
d
o
w
n
F
i
e
l
d
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
a
v
a
i
l
a
b
l
e
B
r
e
a
k
d
o
w
n
F
i
e
l
d
s
(
t
r
a
d
e
s
,
 
s
t
r
a
t
e
g
i
e
s
)
,
 
[
t
r
a
d
e
s
,
 
s
t
r
a
t
e
g
i
e
s
]
)
;


 
 
c
o
n
s
t
 
[
b
r
e
a
k
d
o
w
n
F
i
e
l
d
,
 
s
e
t
B
r
e
a
k
d
o
w
n
F
i
e
l
d
]
 
=
 
u
s
e
S
t
a
t
e
<
s
t
r
i
n
g
>
(
"
"
)
;


 
 
c
o
n
s
t
 
a
c
t
i
v
e
F
i
e
l
d
 
=
 
b
r
e
a
k
d
o
w
n
F
i
e
l
d
 
|
|
 
b
r
e
a
k
d
o
w
n
F
i
e
l
d
s
[
0
]
 
|
|
 
"
"
;


 
 
c
o
n
s
t
 
b
y
F
i
e
l
d
 
=
 
u
s
e
M
e
m
o
(


 
 
 
 
(
)
 
=
>
 
(
a
c
t
i
v
e
F
i
e
l
d
 
?
 
s
t
a
t
s
B
y
G
r
o
u
p
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
f
i
e
l
d
V
a
l
u
e
B
y
N
a
m
e
(
t
,
 
a
c
t
i
v
e
F
i
e
l
d
,
 
b
y
I
d
)
)
 
:
 
[
]
)
,


 
 
 
 
[
t
r
a
d
e
s
,
 
a
c
t
i
v
e
F
i
e
l
d
,
 
b
y
I
d
]


 
 
)
;


 
 
c
o
n
s
t
 
b
y
H
o
u
r
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
s
t
a
t
s
B
y
H
o
u
r
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
e
x
i
t
D
i
s
t
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
d
i
s
t
r
i
b
u
t
i
o
n
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
t
.
e
x
i
t
R
e
a
s
o
n
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
b
y
Q
u
a
l
i
t
y
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
r
e
t
u
r
n
 
s
t
a
t
s
B
y
G
r
o
u
p
(
t
r
a
d
e
s
,
 
(
t
)
 
=
>
 
(
t
.
q
u
a
l
i
t
y
S
c
o
r
e
 
?
 
S
t
r
i
n
g
(
t
.
q
u
a
l
i
t
y
S
c
o
r
e
)
 
:
 
u
n
d
e
f
i
n
e
d
)
)
.
s
o
r
t
(
(
a
,
 
b
)
 
=
>
 
N
u
m
b
e
r
(
a
.
k
e
y
)
 
-
 
N
u
m
b
e
r
(
b
.
k
e
y
)
)
;


 
 
}
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
a
d
h
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
a
d
h
e
r
e
n
c
e
D
e
t
a
i
l
(
t
r
a
d
e
s
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
a
d
h
e
r
e
n
c
e
 
=
 
a
d
h
.
p
c
t
;


 
 
c
o
n
s
t
 
a
d
h
e
r
e
n
c
e
W
e
e
k
l
y
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
a
d
h
e
r
e
n
c
e
T
r
e
n
d
(
t
r
a
d
e
s
,
 
"
w
e
e
k
"
,
 
1
0
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
a
d
h
e
r
e
n
c
e
M
o
n
t
h
l
y
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
a
d
h
e
r
e
n
c
e
T
r
e
n
d
(
t
r
a
d
e
s
,
 
"
m
o
n
t
h
"
,
 
6
)
,
 
[
t
r
a
d
e
s
]
)
;




 
 
c
o
n
s
t
 
v
i
o
l
a
t
i
o
n
R
o
w
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
{


 
 
 
 
c
o
n
s
t
 
w
i
t
h
V
 
=
 
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
t
.
v
i
o
l
a
t
i
o
n
s
.
l
e
n
g
t
h
 
>
 
0
)
;


 
 
 
 
c
o
n
s
t
 
r
o
w
s
 
=
 
s
t
a
t
s
B
y
G
r
o
u
p
(


 
 
 
 
 
 
w
i
t
h
V
.
f
l
a
t
M
a
p
(
(
t
)
 
=
>
 
t
.
v
i
o
l
a
t
i
o
n
s
.
m
a
p
(
(
v
)
 
=
>
 
(
{
 
.
.
.
t
,
 
_
v
:
 
v
 
}
)
)
)
,


 
 
 
 
 
 
(
t
)
 
=
>
 
(
t
 
a
s
 
{
 
_
v
?
:
 
s
t
r
i
n
g
 
}
)
.
_
v


 
 
 
 
)
;


 
 
 
 
r
e
t
u
r
n
 
r
o
w
s
.
s
o
r
t
(
(
a
,
 
b
)
 
=
>
 
a
.
s
t
a
t
s
.
n
e
t
P
n
l
 
-
 
b
.
s
t
a
t
s
.
n
e
t
P
n
l
)
;


 
 
}
,
 
[
t
r
a
d
e
s
]
)
;




 
 
c
o
n
s
t
 
c
l
e
a
n
S
t
a
t
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
c
o
m
p
u
t
e
S
t
a
t
s
(
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
t
.
v
i
o
l
a
t
i
o
n
s
.
l
e
n
g
t
h
 
=
=
=
 
0
)
)
,
 
[
t
r
a
d
e
s
]
)
;


 
 
c
o
n
s
t
 
d
i
r
t
y
S
t
a
t
s
 
=
 
u
s
e
M
e
m
o
(
(
)
 
=
>
 
c
o
m
p
u
t
e
S
t
a
t
s
(
t
r
a
d
e
s
.
f
i
l
t
e
r
(
(
t
)
 
=
>
 
t
.
v
i
o
l
a
t
i
o
n
s
.
l
e
n
g
t
h
 
>
 
0
)
)
,
 
[
t
r
a
d
e
s
]
)
;




 
 
r
e
t
u
r
n
 
(


 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
a
n
a
l
y
t
i
c
s
-
p
a
g
e
 
w
-
f
u
l
l
 
m
a
x
-
w
-
[
1
3
6
0
p
x
]
 
m
x
-
a
u
t
o
 
s
p
a
c
e
-
y
-
8
 
p
x
-
4
 
s
m
:
p
x
-
6
 
x
l
:
p
x
-
8
"
>


 
 
 
 
 
 
{
/
*
 
C
o
m
p
a
c
t
 
p
i
l
l
 
f
i
l
t
e
r
s
 
—
 
c
h
i
p
s
 
b
e
l
o
w
 
s
h
o
w
 
o
n
l
y
 
w
h
a
t
'
s
 
a
c
t
i
v
e
,
 
s
o
 
t
h
e


 
 
 
 
 
 
 
 
 
 
b
a
r
 
s
t
a
y
s
 
q
u
i
e
t
 
u
n
t
i
l
 
y
o
u
 
u
s
e
 
i
t
.
 
*
/
}


 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
a
n
a
l
y
t
i
c
s
-
h
e
a
d
e
r
 
f
l
e
x
 
f
l
e
x
-
w
r
a
p
 
i
t
e
m
s
-
e
n
d
 
j
u
s
t
i
f
y
-
b
e
t
w
e
e
n
 
g
a
p
-
4
"
>


 
 
 
 
 
 
 
 
<
d
i
v
>


 
 
 
 
 
 
 
 
 
 
<
h
1
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
t
r
a
c
k
i
n
g
-
[
-
0
.
0
3
e
m
]
 
t
e
x
t
-
i
n
k
 
s
m
:
t
e
x
t
-
[
2
8
p
x
]
"
>
A
n
a
l
y
t
i
c
s
<
/
h
1
>


 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
R
e
v
i
e
w
 
p
e
r
f
o
r
m
a
n
c
e
,
 
e
x
e
c
u
t
i
o
n
 
q
u
a
l
i
t
y
,
 
a
n
d
 
w
h
e
r
e
 
y
o
u
r
 
e
d
g
e
 
i
s
 
s
t
r
o
n
g
e
s
t
.
<
/
p
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
a
n
a
l
y
t
i
c
s
-
s
u
m
m
a
r
y
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
{
t
r
a
d
e
s
.
l
e
n
g
t
h
}
 
t
r
a
d
e
s
 
i
n
 
v
i
e
w


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
a
n
a
l
y
t
i
c
s
-
f
i
l
t
e
r
-
s
h
e
l
l
"
>


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
f
l
e
x
-
w
r
a
p
 
i
t
e
m
s
-
c
e
n
t
e
r
 
g
a
p
-
2
"
>


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
r
o
u
n
d
e
d
-
f
u
l
l
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
 
p
-
0
.
5
"
>


 
 
 
 
 
 
 
 
 
 
{
(
[


 
 
 
 
 
 
 
 
 
 
 
 
[
"
l
i
v
e
"
,
 
"
L
i
v
e
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
b
a
c
k
t
e
s
t
"
,
 
"
B
a
c
k
t
e
s
t
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
f
o
r
w
a
r
d
"
,
 
"
F
o
r
w
a
r
d
"
]
,


 
 
 
 
 
 
 
 
 
 
]
 
a
s
 
[
"
l
i
v
e
"
 
|
 
"
b
a
c
k
t
e
s
t
"
 
|
 
"
f
o
r
w
a
r
d
"
,
 
s
t
r
i
n
g
]
[
]
)
.
m
a
p
(
(
[
v
,
 
l
]
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
b
u
t
t
o
n


 
 
 
 
 
 
 
 
 
 
 
 
 
 
k
e
y
=
{
v
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
o
n
C
l
i
c
k
=
{
(
)
 
=
>
 
s
e
t
D
a
t
a
s
e
t
(
v
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
l
a
s
s
N
a
m
e
=
{
`
r
o
u
n
d
e
d
-
f
u
l
l
 
p
x
-
3
 
p
y
-
1
 
t
e
x
t
-
x
s
 
t
r
a
n
s
i
t
i
o
n
 
$
{


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
d
a
t
a
s
e
t
 
=
=
=
 
v
 
?
 
"
b
g
-
s
u
r
f
a
c
e
 
t
e
x
t
-
i
n
k
"
 
:
 
"
t
e
x
t
-
m
u
t
e
 
h
o
v
e
r
:
t
e
x
t
-
s
u
b
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
}
`
}


 
 
 
 
 
 
 
 
 
 
 
 
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
l
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
d
a
t
a
s
e
t
C
o
u
n
t
s
[
v
]
 
>
 
0
 
&
&
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
m
l
-
1
.
5
 
f
o
n
t
-
m
o
n
o
 
o
p
a
c
i
t
y
-
6
0
"
>
{
d
a
t
a
s
e
t
C
o
u
n
t
s
[
v
]
}
<
/
s
p
a
n
>
}


 
 
 
 
 
 
 
 
 
 
 
 
<
/
b
u
t
t
o
n
>


 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
 
 
{
d
a
t
a
s
e
t
 
=
=
=
 
"
l
i
v
e
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
r
o
u
n
d
e
d
-
f
u
l
l
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
 
p
-
0
.
5
"
>


 
 
 
 
 
 
 
 
 
 
{
(
[


 
 
 
 
 
 
 
 
 
 
 
 
[
"
a
l
l
"
,
 
"
A
l
l
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
f
u
n
d
e
d
"
,
 
"
F
u
n
d
e
d
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
c
h
a
l
l
e
n
g
e
"
,
 
"
C
h
a
l
l
e
n
g
e
"
]
,


 
 
 
 
 
 
 
 
 
 
]
 
a
s
 
[
C
a
p
i
t
a
l
S
t
a
g
e
,
 
s
t
r
i
n
g
]
[
]
)
.
m
a
p
(
(
[
v
,
 
l
]
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
b
u
t
t
o
n


 
 
 
 
 
 
 
 
 
 
 
 
 
 
k
e
y
=
{
v
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
o
n
C
l
i
c
k
=
{
(
)
 
=
>
 
s
e
t
S
t
a
g
e
(
v
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
l
a
s
s
N
a
m
e
=
{
`
r
o
u
n
d
e
d
-
f
u
l
l
 
p
x
-
3
 
p
y
-
1
 
t
e
x
t
-
x
s
 
t
r
a
n
s
i
t
i
o
n
 
$
{


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
s
t
a
g
e
 
=
=
=
 
v
 
?
 
"
b
g
-
s
u
r
f
a
c
e
 
t
e
x
t
-
i
n
k
"
 
:
 
"
t
e
x
t
-
m
u
t
e
 
h
o
v
e
r
:
t
e
x
t
-
s
u
b
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
}
`
}


 
 
 
 
 
 
 
 
 
 
 
 
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
l
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
s
t
a
g
e
C
o
u
n
t
s
[
v
]
 
>
 
0
 
&
&
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
m
l
-
1
.
5
 
f
o
n
t
-
m
o
n
o
 
o
p
a
c
i
t
y
-
6
0
"
>
{
s
t
a
g
e
C
o
u
n
t
s
[
v
]
}
<
/
s
p
a
n
>
}


 
 
 
 
 
 
 
 
 
 
 
 
<
/
b
u
t
t
o
n
>


 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
<
F
i
l
t
e
r
P
i
l
l
 
l
a
b
e
l
=
"
R
a
n
g
e
"
 
v
a
l
u
e
=
{
f
R
a
n
g
e
 
=
=
=
 
"
a
l
l
"
 
?
 
"
"
 
:
 
`
$
{
f
R
a
n
g
e
}
d
`
}
 
o
n
C
h
a
n
g
e
=
{
s
e
t
F
R
a
n
g
e
}


 
 
 
 
 
 
 
 
 
 
o
p
t
i
o
n
s
=
{
[
[
"
a
l
l
"
,
 
"
A
l
l
 
t
i
m
e
"
]
,
 
[
"
7
"
,
 
"
7
 
d
a
y
s
"
]
,
 
[
"
3
0
"
,
 
"
3
0
 
d
a
y
s
"
]
,
 
[
"
9
0
"
,
 
"
9
0
 
d
a
y
s
"
]
,
 
[
"
3
6
5
"
,
 
"
1
 
y
e
a
r
"
]
]
}
 
/
>


 
 
 
 
 
 
 
 
<
F
i
l
t
e
r
P
i
l
l
 
l
a
b
e
l
=
"
S
t
r
a
t
e
g
y
"
 
v
a
l
u
e
=
{
f
S
t
r
a
t
e
g
y
}
 
o
n
C
h
a
n
g
e
=
{
s
e
t
F
S
t
r
a
t
e
g
y
}


 
 
 
 
 
 
 
 
 
 
o
p
t
i
o
n
s
=
{
[
[
"
"
,
 
"
A
l
l
 
s
t
r
a
t
e
g
i
e
s
"
]
,
 
.
.
.
s
t
r
a
t
e
g
i
e
s
.
m
a
p
(
(
x
)
 
=
>
 
[
x
.
i
d
,
 
x
.
n
a
m
e
]
 
a
s
 
[
s
t
r
i
n
g
,
 
s
t
r
i
n
g
]
)
]
}
 
/
>


 
 
 
 
 
 
 
 
<
F
i
l
t
e
r
P
i
l
l
 
l
a
b
e
l
=
"
S
e
s
s
i
o
n
"
 
v
a
l
u
e
=
{
f
S
e
s
s
i
o
n
}
 
o
n
C
h
a
n
g
e
=
{
s
e
t
F
S
e
s
s
i
o
n
}


 
 
 
 
 
 
 
 
 
 
o
p
t
i
o
n
s
=
{
[
[
"
"
,
 
"
A
l
l
 
s
e
s
s
i
o
n
s
"
]
,
 
.
.
.
S
E
S
S
I
O
N
S
.
m
a
p
(
(
x
)
 
=
>
 
[
x
,
 
x
]
 
a
s
 
[
s
t
r
i
n
g
,
 
s
t
r
i
n
g
]
)
]
}
 
/
>


 
 
 
 
 
 
 
 
<
F
i
l
t
e
r
P
i
l
l
 
l
a
b
e
l
=
"
S
i
d
e
"
 
v
a
l
u
e
=
{
f
S
i
d
e
}
 
o
n
C
h
a
n
g
e
=
{
s
e
t
F
S
i
d
e
}


 
 
 
 
 
 
 
 
 
 
o
p
t
i
o
n
s
=
{
[
[
"
"
,
 
"
L
o
n
g
 
&
 
s
h
o
r
t
"
]
,
 
[
"
l
o
n
g
"
,
 
"
L
o
n
g
"
]
,
 
[
"
s
h
o
r
t
"
,
 
"
S
h
o
r
t
"
]
]
}
 
/
>


 
 
 
 
 
 
 
 
<
F
i
l
t
e
r
P
i
l
l
 
l
a
b
e
l
=
"
O
u
t
c
o
m
e
"
 
v
a
l
u
e
=
{
f
O
u
t
c
o
m
e
}
 
o
n
C
h
a
n
g
e
=
{
s
e
t
F
O
u
t
c
o
m
e
}


 
 
 
 
 
 
 
 
 
 
o
p
t
i
o
n
s
=
{
[
[
"
"
,
 
"
A
l
l
 
o
u
t
c
o
m
e
s
"
]
,
 
[
"
w
i
n
"
,
 
"
W
i
n
s
"
]
,
 
[
"
l
o
s
s
"
,
 
"
L
o
s
s
e
s
"
]
,
 
[
"
b
e
"
,
 
"
B
r
e
a
k
e
v
e
n
"
]
]
}
 
/
>


 
 
 
 
 
 
 
 
<
F
i
l
t
e
r
P
i
l
l
 
l
a
b
e
l
=
"
T
r
a
d
e
 
t
y
p
e
"
 
v
a
l
u
e
=
{
f
T
y
p
e
}
 
o
n
C
h
a
n
g
e
=
{
s
e
t
F
T
y
p
e
}


 
 
 
 
 
 
 
 
 
 
o
p
t
i
o
n
s
=
{
[


 
 
 
 
 
 
 
 
 
 
 
 
[
"
"
,
 
"
A
l
l
 
t
y
p
e
s
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
t
y
p
e
1
"
,
 
"
T
y
p
e
 
1
 
—
 
p
l
a
n
,
 
w
o
n
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
t
y
p
e
2
"
,
 
"
T
y
p
e
 
2
 
—
 
p
l
a
n
,
 
s
t
o
p
p
e
d
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
t
y
p
e
3
"
,
 
"
T
y
p
e
 
3
 
—
 
o
f
f
-
p
l
a
n
,
 
w
o
n
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
t
y
p
e
4
"
,
 
"
T
y
p
e
 
4
 
—
 
o
f
f
-
p
l
a
n
,
 
l
o
s
t
"
]
,


 
 
 
 
 
 
 
 
 
 
 
 
[
"
u
n
c
l
a
s
s
i
f
i
e
d
"
,
 
"
U
n
c
l
a
s
s
i
f
i
e
d
"
]
,


 
 
 
 
 
 
 
 
 
 
]
}
 
/
>




 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
l
-
a
u
t
o
 
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
g
a
p
-
3
"
>


 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
{
t
r
a
d
e
s
.
l
e
n
g
t
h
}
 
t
r
a
d
e
s
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
{
h
a
s
L
i
n
k
e
d
 
&
&
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
T
a
b
s
 
t
a
b
s
=
{
[
"
B
y
 
s
e
t
u
p
"
,
 
"
B
y
 
e
x
e
c
u
t
i
o
n
"
]
}
 
a
c
t
i
v
e
=
{
c
o
u
n
t
M
o
d
e
}
 
o
n
C
h
a
n
g
e
=
{
(
v
)
 
=
>
 
s
e
t
C
o
u
n
t
M
o
d
e
(
v
 
a
s
 
C
o
u
n
t
M
o
d
e
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
{
(
f
R
a
n
g
e
 
!
=
=
 
"
a
l
l
"
 
|
|
 
f
S
t
r
a
t
e
g
y
 
|
|
 
f
S
e
s
s
i
o
n
 
|
|
 
f
S
i
d
e
 
|
|
 
f
O
u
t
c
o
m
e
 
|
|
 
f
T
y
p
e
)
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
-
m
t
-
3
 
f
l
e
x
 
f
l
e
x
-
w
r
a
p
 
i
t
e
m
s
-
c
e
n
t
e
r
 
g
a
p
-
1
.
5
"
>


 
 
 
 
 
 
 
 
 
 
{
f
R
a
n
g
e
 
!
=
=
 
"
a
l
l
"
 
&
&
 
<
F
i
l
t
e
r
C
h
i
p
 
l
a
b
e
l
=
{
`
l
a
s
t
 
$
{
f
R
a
n
g
e
}
 
d
a
y
s
`
}
 
o
n
C
l
e
a
r
=
{
(
)
 
=
>
 
s
e
t
F
R
a
n
g
e
(
"
a
l
l
"
)
}
 
/
>
}


 
 
 
 
 
 
 
 
 
 
{
f
S
t
r
a
t
e
g
y
 
&
&
 
<
F
i
l
t
e
r
C
h
i
p
 
l
a
b
e
l
=
{
s
t
r
a
t
e
g
i
e
s
.
f
i
n
d
(
(
x
)
 
=
>
 
x
.
i
d
 
=
=
=
 
f
S
t
r
a
t
e
g
y
)
?
.
n
a
m
e
 
?
?
 
"
s
t
r
a
t
e
g
y
"
}
 
o
n
C
l
e
a
r
=
{
(
)
 
=
>
 
s
e
t
F
S
t
r
a
t
e
g
y
(
"
"
)
}
 
/
>
}


 
 
 
 
 
 
 
 
 
 
{
f
S
e
s
s
i
o
n
 
&
&
 
<
F
i
l
t
e
r
C
h
i
p
 
l
a
b
e
l
=
{
f
S
e
s
s
i
o
n
}
 
o
n
C
l
e
a
r
=
{
(
)
 
=
>
 
s
e
t
F
S
e
s
s
i
o
n
(
"
"
)
}
 
/
>
}


 
 
 
 
 
 
 
 
 
 
{
f
S
i
d
e
 
&
&
 
<
F
i
l
t
e
r
C
h
i
p
 
l
a
b
e
l
=
{
f
S
i
d
e
}
 
o
n
C
l
e
a
r
=
{
(
)
 
=
>
 
s
e
t
F
S
i
d
e
(
"
"
)
}
 
/
>
}


 
 
 
 
 
 
 
 
 
 
{
f
O
u
t
c
o
m
e
 
&
&
 
<
F
i
l
t
e
r
C
h
i
p
 
l
a
b
e
l
=
{
f
O
u
t
c
o
m
e
}
 
o
n
C
l
e
a
r
=
{
(
)
 
=
>
 
s
e
t
F
O
u
t
c
o
m
e
(
"
"
)
}
 
/
>
}


 
 
 
 
 
 
 
 
 
 
{
f
T
y
p
e
 
&
&
 
<
F
i
l
t
e
r
C
h
i
p
 
l
a
b
e
l
=
{
f
T
y
p
e
.
r
e
p
l
a
c
e
(
"
t
y
p
e
"
,
 
"
T
y
p
e
 
"
)
}
 
o
n
C
l
e
a
r
=
{
(
)
 
=
>
 
s
e
t
F
T
y
p
e
(
"
"
)
}
 
/
>
}


 
 
 
 
 
 
 
 
 
 
<
b
u
t
t
o
n


 
 
 
 
 
 
 
 
 
 
 
 
o
n
C
l
i
c
k
=
{
(
)
 
=
>
 
{
 
s
e
t
F
R
a
n
g
e
(
"
a
l
l
"
)
;
 
s
e
t
F
S
t
r
a
t
e
g
y
(
"
"
)
;
 
s
e
t
F
S
e
s
s
i
o
n
(
"
"
)
;
 
s
e
t
F
S
i
d
e
(
"
"
)
;
 
s
e
t
F
O
u
t
c
o
m
e
(
"
"
)
;
 
s
e
t
F
T
y
p
e
(
"
"
)
;
 
}
}


 
 
 
 
 
 
 
 
 
 
 
 
c
l
a
s
s
N
a
m
e
=
"
m
l
-
1
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
 
u
n
d
e
r
l
i
n
e
-
o
f
f
s
e
t
-
2
 
h
o
v
e
r
:
t
e
x
t
-
s
u
b
 
h
o
v
e
r
:
u
n
d
e
r
l
i
n
e
"


 
 
 
 
 
 
 
 
 
 
>


 
 
 
 
 
 
 
 
 
 
 
 
C
l
e
a
r
 
f
i
l
t
e
r
s


 
 
 
 
 
 
 
 
 
 
<
/
b
u
t
t
o
n
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
s
p
l
i
t
.
c
h
a
l
l
e
n
g
e
T
r
a
d
e
s
 
>
 
0
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
f
l
e
x
-
w
r
a
p
 
i
t
e
m
s
-
c
e
n
t
e
r
 
g
a
p
-
x
-
6
 
g
a
p
-
y
-
2
 
r
o
u
n
d
e
d
-
x
l
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
 
b
g
-
s
u
r
f
a
c
e
/
4
0
 
p
x
-
4
 
p
y
-
2
.
5
 
t
e
x
t
-
x
s
"
>


 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
{
m
o
n
e
y
S
c
o
p
e
 
=
=
=
 
"
R
e
a
l
 
m
o
n
e
y
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
"
S
h
o
w
i
n
g
 
f
u
n
d
e
d
 
a
c
c
o
u
n
t
s
 
o
n
l
y
 
—
 
t
h
i
s
 
i
s
 
w
i
t
h
d
r
a
w
a
b
l
e
 
p
r
o
f
i
t
.
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
m
o
n
e
y
S
c
o
p
e
 
=
=
=
 
"
C
h
a
l
l
e
n
g
e
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
"
S
h
o
w
i
n
g
 
e
v
a
l
u
a
t
i
o
n
 
a
c
c
o
u
n
t
s
 
o
n
l
y
 
—
 
t
h
i
s
 
P
&
L
 
i
s
 
s
c
o
r
e
,
 
n
o
t
 
m
o
n
e
y
.
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
"
S
h
o
w
i
n
g
 
e
v
e
r
y
t
h
i
n
g
 
—
 
d
o
l
l
a
r
 
t
o
t
a
l
s
 
m
i
x
 
r
e
a
l
 
p
r
o
f
i
t
 
w
i
t
h
 
c
h
a
l
l
e
n
g
e
 
s
c
o
r
e
.
"
}


 
 
 
 
 
 
 
 
 
 
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
m
l
-
a
u
t
o
 
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
g
a
p
-
4
 
f
o
n
t
-
m
o
n
o
"
>


 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
{
s
i
g
n
C
o
l
o
r
(
s
p
l
i
t
.
r
e
a
l
P
n
l
)
}
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
e
a
l
 
{
f
m
t
M
o
n
e
y
(
s
p
l
i
t
.
r
e
a
l
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
m
l
-
1
 
t
e
x
t
-
[
1
0
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
(
{
s
p
l
i
t
.
r
e
a
l
T
r
a
d
e
s
}
)
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
h
a
l
l
e
n
g
e
 
{
f
m
t
M
o
n
e
y
(
s
p
l
i
t
.
c
h
a
l
l
e
n
g
e
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
m
l
-
1
 
t
e
x
t
-
[
1
0
p
x
]
"
>
(
{
s
p
l
i
t
.
c
h
a
l
l
e
n
g
e
T
r
a
d
e
s
}
)
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
d
a
t
a
s
e
t
 
!
=
=
 
"
l
i
v
e
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
r
o
u
n
d
e
d
-
x
l
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
a
c
c
e
n
t
/
3
0
 
b
g
-
a
c
c
e
n
t
/
[
0
.
0
5
]
 
p
x
-
4
 
p
y
-
3
 
t
e
x
t
-
x
s
 
t
e
x
t
-
s
u
b
"
>


 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
f
o
n
t
-
m
e
d
i
u
m
 
t
e
x
t
-
a
c
c
e
n
t
"
>


 
 
 
 
 
 
 
 
 
 
 
 
{
d
a
t
a
s
e
t
 
=
=
=
 
"
b
a
c
k
t
e
s
t
"
 
?
 
"
B
a
c
k
t
e
s
t
 
r
e
s
u
l
t
s
"
 
:
 
"
F
o
r
w
a
r
d
 
t
e
s
t
 
r
e
s
u
l
t
s
"
}
.


 
 
 
 
 
 
 
 
 
 
<
/
s
p
a
n
>
{
"
 
"
}


 
 
 
 
 
 
 
 
 
 
S
a
m
e
 
a
n
a
l
y
t
i
c
s
,
 
s
e
p
a
r
a
t
e
 
b
o
o
k
 
—
 
t
h
e
s
e
 
n
e
v
e
r
 
m
i
x
 
i
n
t
o
 
l
i
v
e
 
p
e
r
f
o
r
m
a
n
c
e
.
 
M
a
n
u
a
l
 
b
a
c
k
t
e
s
t
s
 
t
y
p
i
c
a
l
l
y
 
o
v
e
r
s
t
a
t
e


 
 
 
 
 
 
 
 
 
 
l
i
v
e
 
r
e
s
u
l
t
s
 
b
y
 
2
0
–
3
0
%
,
 
s
o
 
t
r
e
a
t
 
e
x
p
e
c
t
a
n
c
y
 
h
e
r
e
 
a
s
 
a
 
c
e
i
l
i
n
g
 
r
a
t
h
e
r
 
t
h
a
n
 
a
 
f
o
r
e
c
a
s
t
.


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
<
T
a
b
s
 
t
a
b
s
=
{
T
A
B
S
}
 
a
c
t
i
v
e
=
{
t
a
b
}
 
o
n
C
h
a
n
g
e
=
{
s
e
t
T
a
b
}
 
/
>




 
 
 
 
 
 
{
h
a
s
L
i
n
k
e
d
 
&
&
 
c
o
u
n
t
M
o
d
e
 
=
=
=
 
"
B
y
 
s
e
t
u
p
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
-
m
t
-
2
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
C
o
u
n
t
i
n
g
 
e
a
c
h
 
i
d
e
a
 
o
n
c
e
.
 
T
h
e
 
s
a
m
e
 
s
e
t
u
p
 
t
a
k
e
n
 
o
n
 
m
u
l
t
i
p
l
e
 
a
c
c
o
u
n
t
s
 
i
s
 
o
n
e
 
d
a
t
a
 
p
o
i
n
t
 
—
 
m
o
n
e
y
 
t
o
t
a
l
s
 
s
t
i
l
l
 
c
o
u
n
t
 
e
v
e
r
y
 
f
i
l
l
.


 
 
 
 
 
 
 
 
<
/
p
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
r
a
d
e
s
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
<
E
m
p
t
y
S
t
a
t
e


 
 
 
 
 
 
 
 
 
 
t
i
t
l
e
=
{


 
 
 
 
 
 
 
 
 
 
 
 
a
l
l
L
i
v
e
C
o
u
n
t
 
=
=
=
 
0


 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
d
a
t
a
s
e
t
 
=
=
=
 
"
l
i
v
e
"
 
?
 
"
N
o
t
h
i
n
g
 
t
o
 
a
n
a
l
y
z
e
 
y
e
t
"
 
:
 
`
N
o
 
$
{
d
a
t
a
s
e
t
}
 
t
r
a
d
e
s
 
y
e
t
`


 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
r
a
w
V
i
s
i
b
l
e
.
l
e
n
g
t
h
 
=
=
=
 
0


 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
"
N
o
 
t
r
a
d
e
s
 
i
n
 
t
h
i
s
 
v
i
e
w
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
"
N
o
 
t
r
a
d
e
s
 
m
a
t
c
h
 
t
h
e
s
e
 
f
i
l
t
e
r
s
"


 
 
 
 
 
 
 
 
 
 
}


 
 
 
 
 
 
 
 
 
 
b
o
d
y
=
{


 
 
 
 
 
 
 
 
 
 
 
 
a
l
l
L
i
v
e
C
o
u
n
t
 
=
=
=
 
0


 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
d
a
t
a
s
e
t
 
=
=
=
 
"
l
i
v
e
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
"
O
n
c
e
 
y
o
u
'
v
e
 
l
o
g
g
e
d
 
t
r
a
d
e
s
,
 
t
h
i
s
 
p
a
g
e
 
b
r
e
a
k
s
 
d
o
w
n
 
w
h
a
t
'
s
 
w
o
r
k
i
n
g
 
—
 
b
y
 
p
a
i
r
,
 
s
e
s
s
i
o
n
,
 
s
t
r
a
t
e
g
y
,
 
t
a
g
,
 
a
n
d
 
r
u
l
e
 
d
i
s
c
i
p
l
i
n
e
.
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
`
L
o
g
 
$
{
d
a
t
a
s
e
t
}
 
t
r
a
d
e
s
 
f
r
o
m
 
t
h
e
 
J
o
u
r
n
a
l
'
s
 
$
{
d
a
t
a
s
e
t
 
=
=
=
 
"
b
a
c
k
t
e
s
t
"
 
?
 
"
B
a
c
k
t
e
s
t
"
 
:
 
"
F
o
r
w
a
r
d
"
}
 
t
a
b
 
a
n
d
 
t
h
e
y
 
w
i
l
l
 
b
e
 
a
n
a
l
y
s
e
d
 
h
e
r
e
.
`


 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
r
a
w
V
i
s
i
b
l
e
.
l
e
n
g
t
h
 
=
=
=
 
0


 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
`
Y
o
u
 
h
a
v
e
 
$
{
a
l
l
L
i
v
e
C
o
u
n
t
}
 
l
o
g
g
e
d
 
t
r
a
d
e
$
{
a
l
l
L
i
v
e
C
o
u
n
t
 
=
=
=
 
1
 
?
 
"
"
 
:
 
"
s
"
}
,
 
b
u
t
 
n
o
n
e
 
i
n
 
t
h
e
 
c
u
r
r
e
n
t
 
a
c
c
o
u
n
t
 
o
r
 
c
a
p
i
t
a
l
 
s
t
a
g
e
.
 
C
h
e
c
k
 
t
h
e
 
a
c
c
o
u
n
t
 
s
e
l
e
c
t
o
r
 
a
b
o
v
e
 
a
n
d
 
t
h
e
 
A
l
l
/
F
u
n
d
e
d
/
C
h
a
l
l
e
n
g
e
 
s
w
i
t
c
h
.
`


 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
`
$
{
r
a
w
V
i
s
i
b
l
e
.
l
e
n
g
t
h
}
 
t
r
a
d
e
$
{
r
a
w
V
i
s
i
b
l
e
.
l
e
n
g
t
h
 
=
=
=
 
1
 
?
 
"
"
 
:
 
"
s
"
}
 
i
n
 
v
i
e
w
,
 
b
u
t
 
t
h
e
 
f
i
l
t
e
r
s
 
e
x
c
l
u
d
e
 
t
h
e
m
 
a
l
l
.
 
C
l
e
a
r
 
t
h
e
 
f
i
l
t
e
r
 
c
h
i
p
s
 
a
b
o
v
e
.
`


 
 
 
 
 
 
 
 
 
 
}


 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
<
>


 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
O
v
e
r
v
i
e
w
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
a
n
a
l
y
t
i
c
s
-
p
a
g
e
 
m
x
-
a
u
t
o
 
w
-
f
u
l
l
 
m
a
x
-
w
-
[
1
3
6
0
p
x
]
 
s
p
a
c
e
-
y
-
8
 
p
x
-
4
 
p
b
-
1
2
 
s
m
:
p
x
-
6
 
x
l
:
p
x
-
8
"
>


 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
5
 
f
l
e
x
 
i
t
e
m
s
-
s
t
a
r
t
 
j
u
s
t
i
f
y
-
b
e
t
w
e
e
n
 
g
a
p
-
3
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
h
3
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
l
g
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
t
e
x
t
-
i
n
k
"
>
P
r
o
f
i
t
 
a
n
d
 
l
o
s
s
<
/
h
3
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
s
t
a
g
e
 
=
=
=
 
"
f
u
n
d
e
d
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
"
f
u
n
d
e
d
 
a
c
c
o
u
n
t
s
 
o
n
l
y
 
—
 
r
e
a
l
 
m
o
n
e
y
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
s
t
a
g
e
 
=
=
=
 
"
c
h
a
l
l
e
n
g
e
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
"
c
h
a
l
l
e
n
g
e
 
a
c
c
o
u
n
t
s
 
o
n
l
y
 
—
 
n
o
t
i
o
n
a
l
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
m
i
x
e
d
S
t
a
g
e
s


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
"
a
l
l
 
a
c
c
o
u
n
t
s
 
—
 
f
u
n
d
e
d
 
a
n
d
 
c
h
a
l
l
e
n
g
e
 
c
o
m
b
i
n
e
d
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
"
o
v
e
r
 
t
i
m
e
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
p
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
r
o
u
n
d
e
d
-
l
g
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
e
d
g
e
 
p
-
0
.
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
(
[
"
M
o
n
e
y
"
,
 
"
R
"
]
 
a
s
 
c
o
n
s
t
)
.
m
a
p
(
(
m
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
b
u
t
t
o
n


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
k
e
y
=
{
m
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
o
n
C
l
i
c
k
=
{
(
)
 
=
>
 
s
e
t
C
u
r
v
e
M
o
d
e
(
m
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
l
a
s
s
N
a
m
e
=
{
`
r
o
u
n
d
e
d
-
m
d
 
p
x
-
3
 
p
y
-
1
 
t
e
x
t
-
x
s
 
t
r
a
n
s
i
t
i
o
n
 
$
{


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
u
r
v
e
M
o
d
e
 
=
=
=
 
m
 
?
 
"
b
g
-
s
u
r
f
a
c
e
 
t
e
x
t
-
i
n
k
"
 
:
 
"
t
e
x
t
-
m
u
t
e
 
h
o
v
e
r
:
t
e
x
t
-
s
u
b
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
}
`
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
m
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
b
u
t
t
o
n
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
{
/
*
 
S
t
a
t
s
 
l
i
v
e
 
i
n
 
t
h
e
 
c
h
a
r
t
 
h
e
a
d
e
r
 
r
a
t
h
e
r
 
t
h
a
n
 
s
e
p
a
r
a
t
e
 
c
a
r
d
s
 
—
 
f
e
w
e
r


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
b
o
x
e
s
,
 
a
n
d
 
t
h
e
 
n
u
m
b
e
r
s
 
s
i
t
 
n
e
x
t
 
t
o
 
t
h
e
 
s
h
a
p
e
 
t
h
a
t
 
p
r
o
d
u
c
e
d
 
t
h
e
m
.
 
*
/
}


 
 
 
 
 
 
 
 
 
 
 
 
{
/
*
 
O
n
l
y
 
h
e
a
d
l
i
n
e
 
a
c
c
o
u
n
t
 
f
i
g
u
r
e
s
 
l
i
v
e
 
h
e
r
e
 
—
 
p
r
o
f
i
t
 
f
a
c
t
o
r
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
e
x
p
e
c
t
a
n
c
y
 
a
n
d
 
R
R
 
e
a
c
h
 
h
a
v
e
 
t
h
e
i
r
 
o
w
n
 
c
a
r
d
 
b
e
l
o
w
.
 
*
/
}


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
5
 
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
2
 
j
u
s
t
i
f
y
-
i
t
e
m
s
-
s
t
a
r
t
 
g
a
p
-
x
-
4
 
g
a
p
-
y
-
5
 
b
o
r
d
e
r
-
b
 
b
o
r
d
e
r
-
e
d
g
e
/
6
0
 
p
b
-
5
 
s
m
:
g
r
i
d
-
c
o
l
s
-
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
H
e
a
d
S
t
a
t
 
l
a
b
e
l
=
"
N
e
t
 
P
&
L
"
 
v
a
l
u
e
=
{
f
m
t
M
o
n
e
y
(
s
t
a
t
s
.
n
e
t
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}
 
d
e
l
t
a
=
{
p
c
t
C
h
a
n
g
e
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
H
e
a
d
S
t
a
t
 
l
a
b
e
l
=
"
A
c
c
o
u
n
t
 
b
a
l
a
n
c
e
"
 
v
a
l
u
e
=
{
b
a
l
a
n
c
e
 
!
=
=
 
u
n
d
e
f
i
n
e
d
 
?
 
f
m
t
M
o
n
e
y
(
b
a
l
a
n
c
e
,
 
c
u
r
r
e
n
c
y
)
 
:
 
"
—
"
}
 
d
e
l
t
a
=
{
p
c
t
C
h
a
n
g
e
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
H
e
a
d
S
t
a
t
 
l
a
b
e
l
=
"
W
i
n
 
r
a
t
e
"
 
v
a
l
u
e
=
{
f
m
t
P
c
t
(
s
t
a
t
s
.
w
i
n
R
a
t
e
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
H
e
a
d
S
t
a
t
 
l
a
b
e
l
=
"
T
o
t
a
l
 
t
r
a
d
e
s
"
 
v
a
l
u
e
=
{
S
t
r
i
n
g
(
s
t
a
t
s
.
t
o
t
a
l
)
}
 
s
u
p
=
{
`
$
{
s
t
a
t
s
.
w
i
n
s
}
/
$
{
s
t
a
t
s
.
l
o
s
s
e
s
}
`
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
H
e
a
d
S
t
a
t
 
l
a
b
e
l
=
"
B
r
e
a
k
e
v
e
n
 
t
r
a
d
e
s
"
 
v
a
l
u
e
=
{
S
t
r
i
n
g
(
s
t
a
t
s
.
b
r
e
a
k
e
v
e
n
s
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
E
q
u
i
t
y
C
u
r
v
e
 
p
o
i
n
t
s
=
{
c
u
r
v
e
}
 
m
o
d
e
=
{
c
u
r
v
e
M
o
d
e
 
=
=
=
 
"
R
"
 
?
 
"
R
"
 
:
 
"
m
o
n
e
y
"
}
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>




 
 
 
 
 
 
 
 
 
 
{
/
*
 
R
R
 
a
n
a
l
y
t
i
c
s
 
s
t
r
i
p
 
—
 
m
i
r
r
o
r
s
 
t
h
e
 
i
n
s
p
i
r
a
t
i
o
n
'
s
 
c
o
m
p
a
c
t
 
m
e
t
r
i
c
 
r
o
w
.
 
*
/
}


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
m
d
:
g
r
i
d
-
c
o
l
s
-
3
"
>


 
 
 
 
 
 
 
 
 
 
 
 
<
M
i
n
i
M
e
t
r
i
c


 
 
 
 
 
 
 
 
 
 
 
 
 
 
l
a
b
e
l
=
"
A
v
g
 
p
l
a
n
n
e
d
 
R
R
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
v
a
l
u
e
=
{
p
l
a
n
n
e
d
.
n
 
?
 
p
l
a
n
n
e
d
.
a
v
g
.
t
o
F
i
x
e
d
(
2
)
 
:
 
"
—
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
i
g
h
t
L
a
b
e
l
=
"
R
e
a
l
i
z
e
d
 
o
n
 
w
i
n
n
e
r
s
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
i
g
h
t
V
a
l
u
e
=
{
`
$
{
a
v
g
W
i
n
R
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
s
e
r
i
e
s
=
{
r
r
S
e
r
i
e
s
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
n
o
t
e
=
{


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
p
l
a
n
n
e
d
.
n


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
`
$
{
p
l
a
n
n
e
d
.
n
}
 
w
i
t
h
 
a
 
t
a
r
g
e
t
 
s
e
t
 
·
 
w
i
n
n
e
r
s
 
d
e
l
i
v
e
r
 
$
{
(
(
a
v
g
W
i
n
R
 
/
 
(
p
l
a
n
n
e
d
.
a
v
g
 
|
|
 
1
)
)
 
*
 
1
0
0
)
.
t
o
F
i
x
e
d
(
0
)
}
%
 
o
f
 
w
h
a
t
 
y
o
u
 
p
l
a
n
`


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
"
S
e
t
 
e
n
t
r
y
,
 
s
t
o
p
 
a
n
d
 
t
a
r
g
e
t
 
t
o
 
t
r
a
c
k
 
t
h
i
s
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
}


 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
M
i
n
i
M
e
t
r
i
c


 
 
 
 
 
 
 
 
 
 
 
 
 
 
l
a
b
e
l
=
"
A
v
g
 
w
i
n
n
e
r
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
v
a
l
u
e
=
{
`
$
{
a
v
g
W
i
n
R
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
i
g
h
t
L
a
b
e
l
=
"
A
v
g
 
l
o
s
e
r
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
i
g
h
t
V
a
l
u
e
=
{
`
$
{
a
v
g
L
o
s
s
R
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
s
e
r
i
e
s
=
{
w
i
n
S
e
r
i
e
s
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
n
o
t
e
=
{
`
b
e
s
t
 
$
{
s
t
a
t
s
.
l
a
r
g
e
s
t
W
i
n
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}


 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
M
i
n
i
M
e
t
r
i
c


 
 
 
 
 
 
 
 
 
 
 
 
 
 
l
a
b
e
l
=
"
C
o
u
l
d
 
h
a
v
e
 
b
e
e
n
 
B
E
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
v
a
l
u
e
=
{
b
e
M
i
s
s
.
w
i
t
h
D
a
t
a
 
?
 
S
t
r
i
n
g
(
b
e
M
i
s
s
.
c
o
u
n
t
)
 
:
 
"
—
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
i
g
h
t
L
a
b
e
l
=
"
P
e
a
k
 
r
e
a
c
h
e
d
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
i
g
h
t
V
a
l
u
e
=
{
b
e
M
i
s
s
.
c
o
u
n
t
 
?
 
`
$
{
b
e
M
i
s
s
.
m
a
x
P
e
a
k
R
.
t
o
F
i
x
e
d
(
2
)
}
R
`
 
:
 
"
—
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
s
e
r
i
e
s
=
{
[
]
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
n
o
t
e
=
{


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
b
e
M
i
s
s
.
w
i
t
h
D
a
t
a
 
=
=
=
 
0


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
"
L
o
g
 
p
e
a
k
 
R
 
o
n
 
l
o
s
i
n
g
 
t
r
a
d
e
s
 
t
o
 
t
r
a
c
k
 
t
h
i
s
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
b
e
M
i
s
s
.
c
o
u
n
t


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
`
$
{
b
e
M
i
s
s
.
r
S
a
v
e
d
.
t
o
F
i
x
e
d
(
1
)
}
R
 
l
o
s
t
 
t
h
a
t
 
a
 
B
E
 
s
t
o
p
 
w
o
u
l
d
 
h
a
v
e
 
s
a
v
e
d
 
·
 
a
v
g
 
p
e
a
k
 
$
{
b
e
M
i
s
s
.
a
v
g
P
e
a
k
R
.
t
o
F
i
x
e
d
(
2
)
}
R
`


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
"
N
o
 
l
o
s
e
r
 
r
a
n
 
1
R
 
i
n
 
p
r
o
f
i
t
 
f
i
r
s
t
 
—
 
s
t
o
p
s
 
a
r
e
 
p
l
a
c
e
d
 
w
e
l
l
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
}


 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
 
 
 
 
{
/
*
 
E
x
p
e
c
t
a
n
c
y
 
&
 
p
r
o
f
i
t
 
f
a
c
t
o
r
 
—
 
s
i
t
s
 
d
i
r
e
c
t
l
y
 
u
n
d
e
r
 
t
h
e
 
R
R
 
s
t
r
i
p
 
s
o
 
t
h
e


 
 
 
 
 
 
 
 
 
 
 
 
 
 
h
e
a
d
l
i
n
e
 
e
d
g
e
 
n
u
m
b
e
r
s
 
s
t
a
y
 
t
o
g
e
t
h
e
r
.
 
*
/
}


 
 
 
 
 
 
 
 
 
 
<
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
E
x
p
e
c
t
a
n
c
y
 
&
a
m
p
;
 
p
r
o
f
i
t
 
f
a
c
t
o
r
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
s
m
:
g
r
i
d
-
c
o
l
s
-
2
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
j
u
s
t
i
f
y
-
b
e
t
w
e
e
n
 
g
a
p
-
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
i
n
-
w
-
0
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
E
x
p
e
c
t
a
n
c
y
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
{
`
m
t
-
1
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
$
{
s
i
g
n
C
o
l
o
r
(
e
x
p
e
c
t
a
n
c
y
M
o
n
e
y
)
}
`
}
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
f
m
t
M
o
n
e
y
(
e
x
p
e
c
t
a
n
c
y
M
o
n
e
y
,
 
c
u
r
r
e
n
c
y
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
0
.
5
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
p
e
r
 
t
r
a
d
e
 
·
 
{
s
t
a
t
s
.
a
v
g
R
R
.
t
o
F
i
x
e
d
(
2
)
}
R
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
w
-
1
/
2
 
s
h
r
i
n
k
-
0
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
h
-
2
.
5
 
o
v
e
r
f
l
o
w
-
h
i
d
d
e
n
 
r
o
u
n
d
e
d
-
f
u
l
l
 
b
g
-
s
u
r
f
a
c
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
h
-
f
u
l
l
 
r
o
u
n
d
e
d
-
l
-
f
u
l
l
"
 
s
t
y
l
e
=
{
{
 
w
i
d
t
h
:
 
`
$
{
g
r
o
s
s
S
p
l
i
t
}
%
`
,
 
b
a
c
k
g
r
o
u
n
d
:
 
"
l
i
n
e
a
r
-
g
r
a
d
i
e
n
t
(
9
0
d
e
g
,
 
r
g
b
(
v
a
r
(
-
-
p
o
s
)
/
0
.
6
)
,
 
r
g
b
(
v
a
r
(
-
-
p
o
s
)
)
)
"
 
}
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
h
-
f
u
l
l
 
r
o
u
n
d
e
d
-
r
-
f
u
l
l
 
b
g
-
n
e
g
"
 
s
t
y
l
e
=
{
{
 
w
i
d
t
h
:
 
`
$
{
1
0
0
 
-
 
g
r
o
s
s
S
p
l
i
t
}
%
`
 
}
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
.
5
 
f
l
e
x
 
j
u
s
t
i
f
y
-
b
e
t
w
e
e
n
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
[
1
1
p
x
]
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
p
o
s
"
>
{
f
m
t
M
o
n
e
y
(
w
l
.
g
r
o
s
s
W
i
n
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
n
e
g
"
>
{
f
m
t
M
o
n
e
y
(
w
l
.
g
r
o
s
s
L
o
s
s
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>




 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
i
t
e
m
s
-
c
e
n
t
e
r
 
j
u
s
t
i
f
y
-
b
e
t
w
e
e
n
 
g
a
p
-
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
P
r
o
f
i
t
 
f
a
c
t
o
r
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
{
`
m
t
-
1
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
$
{
s
t
a
t
s
.
p
r
o
f
i
t
F
a
c
t
o
r
 
>
=
 
1
.
5
 
?
 
"
t
e
x
t
-
p
o
s
"
 
:
 
s
t
a
t
s
.
p
r
o
f
i
t
F
a
c
t
o
r
 
>
=
 
1
 
?
 
"
t
e
x
t
-
w
a
r
n
"
 
:
 
"
t
e
x
t
-
n
e
g
"
}
`
}
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
f
m
t
P
F
(
s
t
a
t
s
.
p
r
o
f
i
t
F
a
c
t
o
r
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
0
.
5
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
s
t
a
t
s
.
p
r
o
f
i
t
F
a
c
t
o
r
 
>
=
 
2
 
?
 
"
s
t
r
o
n
g
"
 
:
 
s
t
a
t
s
.
p
r
o
f
i
t
F
a
c
t
o
r
 
>
=
 
1
.
5
 
?
 
"
g
o
o
d
"
 
:
 
s
t
a
t
s
.
p
r
o
f
i
t
F
a
c
t
o
r
 
>
=
 
1
 
?
 
"
m
a
r
g
i
n
a
l
"
 
:
 
"
l
o
s
i
n
g
"
}
 
·
 
t
a
r
g
e
t
 
1
.
5
+
 
·
 
i
n
 
R


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
P
F
R
i
n
g
 
v
a
l
u
e
=
{
s
t
a
t
s
.
p
r
o
f
i
t
F
a
c
t
o
r
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
 
 
 
 
{
/
*
 
W
i
n
n
e
r
s
 
v
s
 
l
o
s
e
r
s
 
*
/
}


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
5
 
l
g
:
g
r
i
d
-
c
o
l
s
-
2
"
>


 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
 
c
l
a
s
s
N
a
m
e
=
"
b
o
r
d
e
r
-
p
o
s
/
4
0
 
b
g
-
p
o
s
/
[
0
.
0
3
]
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
 
a
c
t
i
o
n
=
{
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
s
m
 
t
e
x
t
-
p
o
s
"
>
{
f
m
t
M
o
n
e
y
(
w
i
n
M
o
n
e
y
,
 
c
u
r
r
e
n
c
y
)
}
<
/
s
p
a
n
>
}
>
W
i
n
n
e
r
s
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
W
L
L
i
s
t


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
o
w
s
=
{
[


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
T
o
t
a
l
 
w
i
n
n
e
r
s
"
,
 
S
t
r
i
n
g
(
w
l
.
w
i
n
n
e
r
s
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
B
e
s
t
 
w
i
n
"
,
 
f
m
t
R
(
w
l
.
b
e
s
t
W
i
n
R
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
A
v
e
r
a
g
e
 
w
i
n
"
,
 
`
$
{
w
l
.
a
v
g
W
i
n
R
.
t
o
F
i
x
e
d
(
2
)
}
R
`
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
A
v
g
 
w
i
n
 
P
&
L
"
,
 
f
m
t
M
o
n
e
y
(
w
l
.
a
v
g
W
i
n
P
n
l
,
 
c
u
r
r
e
n
c
y
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
M
a
x
 
c
o
n
s
e
c
u
t
i
v
e
 
w
i
n
s
"
,
 
S
t
r
i
n
g
(
w
l
.
m
a
x
C
o
n
s
e
c
u
t
i
v
e
W
i
n
s
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
A
v
g
 
c
o
n
s
e
c
u
t
i
v
e
 
w
i
n
s
"
,
 
w
l
.
a
v
g
C
o
n
s
e
c
u
t
i
v
e
W
i
n
s
.
t
o
F
i
x
e
d
(
2
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
]
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
 
c
l
a
s
s
N
a
m
e
=
"
b
o
r
d
e
r
-
n
e
g
/
4
0
 
b
g
-
n
e
g
/
[
0
.
0
3
]
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
 
a
c
t
i
o
n
=
{
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
s
m
 
t
e
x
t
-
n
e
g
"
>
{
f
m
t
M
o
n
e
y
(
l
o
s
s
M
o
n
e
y
,
 
c
u
r
r
e
n
c
y
)
}
<
/
s
p
a
n
>
}
>
L
o
s
e
r
s
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
W
L
L
i
s
t


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
o
w
s
=
{
[


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
T
o
t
a
l
 
l
o
s
e
r
s
"
,
 
S
t
r
i
n
g
(
w
l
.
l
o
s
e
r
s
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
W
o
r
s
t
 
l
o
s
s
"
,
 
f
m
t
R
(
w
l
.
w
o
r
s
t
L
o
s
s
R
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
A
v
e
r
a
g
e
 
l
o
s
s
"
,
 
`
$
{
w
l
.
a
v
g
L
o
s
s
R
.
t
o
F
i
x
e
d
(
2
)
}
R
`
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
A
v
g
 
l
o
s
s
 
P
&
L
"
,
 
f
m
t
M
o
n
e
y
(
w
l
.
a
v
g
L
o
s
s
P
n
l
,
 
c
u
r
r
e
n
c
y
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
M
a
x
 
c
o
n
s
e
c
u
t
i
v
e
 
l
o
s
s
e
s
"
,
 
S
t
r
i
n
g
(
w
l
.
m
a
x
C
o
n
s
e
c
u
t
i
v
e
L
o
s
s
e
s
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[
"
A
v
g
 
c
o
n
s
e
c
u
t
i
v
e
 
l
o
s
s
e
s
"
,
 
w
l
.
a
v
g
C
o
n
s
e
c
u
t
i
v
e
L
o
s
s
e
s
.
t
o
F
i
x
e
d
(
2
)
]
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
]
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
 
 
 
 
{
d
a
t
a
s
e
t
 
=
=
=
 
"
l
i
v
e
"
 
&
&
 
<
P
l
a
n
V
s
O
f
f
P
l
a
n
 
t
r
a
d
e
s
=
{
v
i
s
i
b
l
e
}
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>
}




 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
l
g
:
g
r
i
d
-
c
o
l
s
-
2
"
>


 
 
 
 
 
 
 
 
 
 
 
 
<
K
p
i
S
c
o
r
e
c
a
r
d
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
D
i
s
c
i
p
l
i
n
e
S
c
a
t
t
e
r
 
/
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
 
 
 
 
{
d
a
t
a
s
e
t
 
=
=
=
 
"
l
i
v
e
"
 
&
&
 
<
E
d
g
e
C
h
e
c
k
 
t
r
a
d
e
s
=
{
r
a
w
V
i
s
i
b
l
e
}
 
/
>
}




 
 
 
 
 
 
 
 
 
 
<
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
s
i
d
e
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
s
m
:
g
r
i
d
-
c
o
l
s
-
2
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
 
c
l
a
s
s
N
a
m
e
=
"
s
i
d
e
-
a
n
a
l
y
s
i
s
-
c
a
r
d
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
i
d
e
-
c
a
r
d
-
h
e
a
d
e
r
 
m
b
-
2
 
t
e
x
t
-
s
m
 
f
o
n
t
-
m
e
d
i
u
m
 
t
e
x
t
-
s
u
b
"
>
T
r
a
d
e
 
s
p
l
i
t
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
i
d
e
-
c
h
a
r
t
-
c
o
n
t
e
n
t
 
s
i
d
e
-
c
h
a
r
t
-
c
o
n
t
e
n
t
-
-
b
a
l
a
n
c
e
d
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
D
o
n
u
t


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
s
l
i
c
e
s
=
{
[


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
 
l
a
b
e
l
:
 
"
L
o
n
g
"
,
 
v
a
l
u
e
:
 
s
i
d
e
S
p
l
i
t
.
l
o
n
g
N
,
 
c
o
l
o
r
:
 
"
r
g
b
(
v
a
r
(
-
-
p
o
s
)
)
"
 
}
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
 
l
a
b
e
l
:
 
"
S
h
o
r
t
"
,
 
v
a
l
u
e
:
 
s
i
d
e
S
p
l
i
t
.
s
h
o
r
t
N
,
 
c
o
l
o
r
:
 
"
r
g
b
(
v
a
r
(
-
-
a
c
c
e
n
t
)
)
"
 
}
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
]
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
e
n
t
e
r
=
{
{
 
v
a
l
u
e
:
 
S
t
r
i
n
g
(
s
i
d
e
S
p
l
i
t
.
l
o
n
g
N
 
+
 
s
i
d
e
S
p
l
i
t
.
s
h
o
r
t
N
)
,
 
l
a
b
e
l
:
 
"
t
r
a
d
e
s
"
 
}
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
 
c
l
a
s
s
N
a
m
e
=
"
s
i
d
e
-
a
n
a
l
y
s
i
s
-
c
a
r
d
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
i
d
e
-
c
a
r
d
-
h
e
a
d
e
r
 
m
b
-
2
 
t
e
x
t
-
s
m
 
f
o
n
t
-
m
e
d
i
u
m
 
t
e
x
t
-
s
u
b
"
>
W
i
n
 
r
a
t
e
 
b
y
 
s
i
d
e
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
i
d
e
-
c
h
a
r
t
-
c
o
n
t
e
n
t
 
s
i
d
e
-
c
h
a
r
t
-
c
o
n
t
e
n
t
-
-
b
a
l
a
n
c
e
d
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
R
i
n
g
C
o
m
p
a
r
e


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
s
i
z
e
=
{
1
3
2
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
i
n
g
s
=
{
[


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
 
l
a
b
e
l
:
 
"
L
o
n
g
"
,
 
v
a
l
u
e
:
 
s
i
d
e
S
p
l
i
t
.
l
o
n
g
W
R
,
 
m
a
x
:
 
1
0
0
,
 
c
o
l
o
r
:
 
"
r
g
b
(
v
a
r
(
-
-
p
o
s
)
)
"
 
}
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
 
l
a
b
e
l
:
 
"
S
h
o
r
t
"
,
 
v
a
l
u
e
:
 
s
i
d
e
S
p
l
i
t
.
s
h
o
r
t
W
R
,
 
m
a
x
:
 
1
0
0
,
 
c
o
l
o
r
:
 
"
r
g
b
(
v
a
r
(
-
-
a
c
c
e
n
t
)
)
"
 
}
,


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
]
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
e
n
t
e
r
=
{
`
$
{
s
i
d
e
S
p
l
i
t
.
l
o
n
g
N
}
L
 
/
 
$
{
s
i
d
e
S
p
l
i
t
.
s
h
o
r
t
N
}
S
`
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
4
 
b
o
r
d
e
r
-
t
 
b
o
r
d
e
r
-
e
d
g
e
/
6
0
 
p
t
-
3
 
t
e
x
t
-
[
1
1
p
x
]
 
l
e
a
d
i
n
g
-
r
e
l
a
x
e
d
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
M
a
t
h
.
a
b
s
(
s
i
d
e
S
p
l
i
t
.
l
o
n
g
W
R
 
-
 
s
i
d
e
S
p
l
i
t
.
s
h
o
r
t
W
R
)
 
>
=
 
1
5
 
&
&
 
s
i
d
e
S
p
l
i
t
.
l
o
n
g
N
 
>
=
 
3
 
&
&
 
s
i
d
e
S
p
l
i
t
.
s
h
o
r
t
N
 
>
=
 
3


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
?
 
`
$
{
s
i
d
e
S
p
l
i
t
.
l
o
n
g
W
R
 
>
 
s
i
d
e
S
p
l
i
t
.
s
h
o
r
t
W
R
 
?
 
"
L
o
n
g
s
"
 
:
 
"
S
h
o
r
t
s
"
}
 
a
r
e
 
w
i
n
n
i
n
g
 
m
a
t
e
r
i
a
l
l
y
 
m
o
r
e
 
—
 
w
o
r
t
h
 
c
h
e
c
k
i
n
g
 
w
h
e
t
h
e
r
 
t
h
e
 
w
e
a
k
e
r
 
s
i
d
e
 
i
s
 
w
o
r
t
h
 
t
r
a
d
i
n
g
 
a
t
 
a
l
l
.
`


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
:
 
"
B
o
t
h
 
s
i
d
e
s
 
p
e
r
f
o
r
m
i
n
g
 
c
o
m
p
a
r
a
b
l
y
.
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
p
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
3
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
b
y
S
i
d
e
}
 
k
e
y
L
a
b
e
l
=
"
S
i
d
e
"
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
 
a
c
t
i
o
n
=
{
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
{
v
i
s
i
b
l
e
.
l
e
n
g
t
h
}
 
t
r
a
d
e
s
<
/
s
p
a
n
>
}
>
O
u
t
c
o
m
e
 
d
i
s
t
r
i
b
u
t
i
o
n
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
<
R
H
i
s
t
o
g
r
a
m
 
r
s
=
{
v
i
s
i
b
l
e
.
m
a
p
(
(
t
)
 
=
>
 
t
.
r
r
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
2
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
A
 
f
a
t
 
l
e
f
t
 
t
a
i
l
 
p
a
s
t
 
−
1
R
 
m
e
a
n
s
 
s
t
o
p
s
 
a
r
e
n
&
a
p
o
s
;
t
 
h
o
l
d
i
n
g
.
 
A
 
h
e
a
l
t
h
y
 
s
h
a
p
e
 
c
l
u
s
t
e
r
s
 
l
o
s
s
e
s
 
a
t
 
−
1
R
 
a
n
d
 
s
p
r
e
a
d
s
 
w
i
n
n
e
r
s
 
r
i
g
h
t
.


 
 
 
 
 
 
 
 
 
 
 
 
<
/
p
>


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>




 
 
 
 
 
 
 
 
 
 
<
D
i
s
c
i
p
l
i
n
e
T
r
e
n
d
 
/
>




 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
m
o
n
t
h
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
{
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
 
!
=
=
 
u
n
d
e
f
i
n
e
d
 
&
&
 
M
a
t
h
.
a
b
s
(
m
o
n
t
h
l
y
[
0
]
?
.
t
o
t
a
l
P
c
t
 
?
?
 
0
)
 
>
 
3
0
0
 
&
&
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
3
 
r
o
u
n
d
e
d
-
x
l
 
b
o
r
d
e
r
 
b
o
r
d
e
r
-
w
a
r
n
/
4
0
 
b
g
-
w
a
r
n
/
[
0
.
0
6
]
 
p
x
-
4
 
p
y
-
2
.
5
 
t
e
x
t
-
[
1
1
p
x
]
 
l
e
a
d
i
n
g
-
s
n
u
g
 
t
e
x
t
-
s
u
b
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
f
o
n
t
-
m
e
d
i
u
m
 
t
e
x
t
-
w
a
r
n
"
>
T
h
e
s
e
 
p
e
r
c
e
n
t
a
g
e
s
 
l
o
o
k
 
i
m
p
l
a
u
s
i
b
l
e
.
<
/
s
p
a
n
>
 
T
h
e
y
 
a
r
e
 
m
e
a
s
u
r
e
d


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
a
g
a
i
n
s
t
 
a
n
 
a
c
c
o
u
n
t
 
b
a
l
a
n
c
e
 
o
f
 
{
f
m
t
M
o
n
e
y
(
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
,
 
c
u
r
r
e
n
c
y
)
}
.
 
I
f
 
t
h
i
s
 
d
a
t
a
 
w
a
s
 
t
e
s
t
e
d
 
o
r
 
t
r
a
d
e
d


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
o
n
 
a
 
d
i
f
f
e
r
e
n
t
 
a
c
c
o
u
n
t
 
s
i
z
e
,
 
s
e
t
 
t
h
e
 
c
o
r
r
e
c
t
 
b
a
l
a
n
c
e
 
o
n
 
t
h
e
 
A
c
c
o
u
n
t
s
 
p
a
g
e
 
—
 
p
e
r
c
e
n
t
a
g
e
s
 
a
r
e
 
o
n
l
y


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
m
e
a
n
i
n
g
f
u
l
 
a
g
a
i
n
s
t
 
t
h
e
 
c
a
p
i
t
a
l
 
t
h
e
 
t
r
a
d
e
s
 
w
e
r
e
 
a
c
t
u
a
l
l
y
 
s
i
z
e
d
 
f
o
r
.


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
 
 
<
M
o
n
t
h
l
y
G
r
i
d
 
r
o
w
s
=
{
m
o
n
t
h
l
y
}
 
c
u
r
r
e
n
c
y
=
{
m
o
n
t
h
l
y
C
u
r
r
e
n
c
y
}
 
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
=
{
s
t
a
r
t
i
n
g
B
a
l
a
n
c
e
}
 
/
>


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>




 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
s
e
s
s
i
o
n
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
s
m
:
g
r
i
d
-
c
o
l
s
-
2
 
x
l
:
g
r
i
d
-
c
o
l
s
-
4
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
s
s
i
o
n
R
a
d
a
r
 
t
i
t
l
e
=
"
W
i
n
 
R
a
t
e
"
 
p
o
i
n
t
s
=
{
r
a
d
a
r
P
o
i
n
t
s
(
(
s
t
)
 
=
>
 
s
t
.
w
i
n
R
a
t
e
,
 
(
v
)
 
=
>
 
f
m
t
P
c
t
(
v
)
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
s
s
i
o
n
R
a
d
a
r
 
t
i
t
l
e
=
"
T
o
t
a
l
 
T
r
a
d
e
s
"
 
p
o
i
n
t
s
=
{
r
a
d
a
r
P
o
i
n
t
s
(
(
s
t
)
 
=
>
 
s
t
.
t
o
t
a
l
,
 
(
v
)
 
=
>
 
S
t
r
i
n
g
(
M
a
t
h
.
r
o
u
n
d
(
v
)
)
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
s
s
i
o
n
R
a
d
a
r
 
t
i
t
l
e
=
"
A
v
g
 
R
R
"
 
p
o
i
n
t
s
=
{
r
a
d
a
r
P
o
i
n
t
s
(
(
s
t
)
 
=
>
 
s
t
.
a
v
g
R
R
,
 
(
v
)
 
=
>
 
`
$
{
v
.
t
o
F
i
x
e
d
(
2
)
}
R
`
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
s
s
i
o
n
R
a
d
a
r
 
t
i
t
l
e
=
"
P
r
o
f
i
t
"
 
p
o
i
n
t
s
=
{
r
a
d
a
r
P
o
i
n
t
s
(
(
s
t
)
 
=
>
 
s
t
.
n
e
t
P
n
l
,
 
(
v
)
 
=
>
 
f
m
t
M
o
n
e
y
(
v
,
 
c
u
r
r
e
n
c
y
)
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
3
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
S
e
s
s
i
o
n
s
 
s
e
t
 
f
r
o
m
 
e
a
c
h
 
t
r
a
d
e
&
a
p
o
s
;
s
 
t
i
m
e
 
(
U
T
C
 
=
 
y
o
u
r
 
A
c
c
r
a
 
l
o
c
a
l
 
t
i
m
e
)
.
 
F
u
l
l
 
b
r
e
a
k
d
o
w
n
 
i
n
 
t
h
e
 
S
e
s
s
i
o
n
s
 
t
a
b
.
<
/
p
>


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>




 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
5
 
l
g
:
g
r
i
d
-
c
o
l
s
-
2
"
>


 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
R
u
l
e
 
a
d
h
e
r
e
n
c
e
 
—
 
w
e
e
k
l
y
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
a
d
h
e
r
e
n
c
e
W
e
e
k
l
y
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
6
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>
M
a
r
k
 
t
r
a
d
e
s
 
a
s
 
f
o
l
l
o
w
e
d
-
p
l
a
n
 
t
o
 
b
u
i
l
d
 
t
h
i
s
 
t
r
e
n
d
.
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
a
d
h
e
r
e
n
c
e
W
e
e
k
l
y
.
m
a
p
(
(
p
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
B
a
r
R
o
w
 
k
e
y
=
{
p
.
l
a
b
e
l
}
 
l
a
b
e
l
=
{
p
.
l
a
b
e
l
}
 
v
a
l
u
e
=
{
p
.
v
a
l
u
e
}
 
m
a
x
=
{
1
0
0
}
 
d
i
s
p
l
a
y
=
{
`
$
{
p
.
v
a
l
u
e
.
t
o
F
i
x
e
d
(
0
)
}
%
 
·
 
$
{
p
.
t
o
t
a
l
}
t
`
}
 
c
o
l
o
r
=
{
p
.
v
a
l
u
e
 
>
=
 
7
0
 
?
 
"
#
2
2
C
5
5
E
"
 
:
 
p
.
v
a
l
u
e
 
>
=
 
5
0
 
?
 
"
#
F
5
9
E
0
B
"
 
:
 
"
#
E
F
4
4
4
4
"
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)


 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
R
u
l
e
 
a
d
h
e
r
e
n
c
e
 
—
 
m
o
n
t
h
l
y
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
a
d
h
e
r
e
n
c
e
M
o
n
t
h
l
y
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
6
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>
M
a
r
k
 
t
r
a
d
e
s
 
a
s
 
f
o
l
l
o
w
e
d
-
p
l
a
n
 
t
o
 
b
u
i
l
d
 
t
h
i
s
 
t
r
e
n
d
.
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
a
d
h
e
r
e
n
c
e
M
o
n
t
h
l
y
.
m
a
p
(
(
p
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
B
a
r
R
o
w
 
k
e
y
=
{
p
.
l
a
b
e
l
}
 
l
a
b
e
l
=
{
p
.
l
a
b
e
l
}
 
v
a
l
u
e
=
{
p
.
v
a
l
u
e
}
 
m
a
x
=
{
1
0
0
}
 
d
i
s
p
l
a
y
=
{
`
$
{
p
.
v
a
l
u
e
.
t
o
F
i
x
e
d
(
0
)
}
%
 
·
 
$
{
p
.
t
o
t
a
l
}
t
`
}
 
c
o
l
o
r
=
{
p
.
v
a
l
u
e
 
>
=
 
7
0
 
?
 
"
#
2
2
C
5
5
E
"
 
:
 
p
.
v
a
l
u
e
 
>
=
 
5
0
 
?
 
"
#
F
5
9
E
0
B
"
 
:
 
"
#
E
F
4
4
4
4
"
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)


 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
B
r
e
a
k
d
o
w
n
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
p
a
c
e
-
y
-
4
"
>


 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
f
l
e
x
 
f
l
e
x
-
w
r
a
p
 
i
t
e
m
s
-
c
e
n
t
e
r
 
j
u
s
t
i
f
y
-
b
e
t
w
e
e
n
 
g
a
p
-
3
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
f
i
e
l
d
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
b
r
e
a
k
d
o
w
n
F
i
e
l
d
s
.
l
e
n
g
t
h
 
>
 
0
 
&
&
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
l
e
c
t
 
v
a
l
u
e
=
{
a
c
t
i
v
e
F
i
e
l
d
}
 
o
n
C
h
a
n
g
e
=
{
(
e
)
 
=
>
 
s
e
t
B
r
e
a
k
d
o
w
n
F
i
e
l
d
(
e
.
t
a
r
g
e
t
.
v
a
l
u
e
)
}
 
c
l
a
s
s
N
a
m
e
=
"
w
-
a
u
t
o
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
b
r
e
a
k
d
o
w
n
F
i
e
l
d
s
.
m
a
p
(
(
f
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
o
p
t
i
o
n
 
k
e
y
=
{
f
}
>
{
f
}
<
/
o
p
t
i
o
n
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
S
e
l
e
c
t
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
4
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
G
r
o
u
p
 
y
o
u
r
 
t
r
a
d
e
s
 
b
y
 
a
n
y
 
f
i
e
l
d
 
y
o
u
r
 
s
t
r
a
t
e
g
i
e
s
 
d
e
f
i
n
e
 
—
 
E
n
t
r
y
 
M
o
d
e
l
,
 
H
T
F
 
B
i
a
s
,
 
Z
o
n
e
 
T
y
p
e
,
 
T
r
i
g
g
e
r
,
 
a
n
y
t
h
i
n
g
.
 
T
h
i
s
 
i
s
 
h
o
w
 
t
h
e
 
j
o
u
r
n
a
l
 
s
t
a
y
s
 
m
e
t
h
o
d
o
l
o
g
y
-
a
g
n
o
s
t
i
c
.


 
 
 
 
 
 
 
 
 
 
 
 
<
/
p
>


 
 
 
 
 
 
 
 
 
 
 
 
{
b
r
e
a
k
d
o
w
n
F
i
e
l
d
s
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
8
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
N
o
 
c
u
s
t
o
m
 
f
i
e
l
d
s
 
y
e
t
.
 
A
d
d
 
f
i
e
l
d
s
 
t
o
 
a
 
s
t
r
a
t
e
g
y
 
(
S
t
r
a
t
e
g
i
e
s
 
→
 
C
r
e
a
t
e
 
→
 
C
u
s
t
o
m
 
f
i
e
l
d
s
,
 
o
r
 
s
t
a
r
t
 
f
r
o
m
 
a
 
t
e
m
p
l
a
t
e
)
 
a
n
d
 
t
h
e
y
&
a
p
o
s
;
l
l
 
s
h
o
w
 
u
p
 
h
e
r
e
.


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
b
y
F
i
e
l
d
}
 
k
e
y
L
a
b
e
l
=
{
a
c
t
i
v
e
F
i
e
l
d
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
b
y
F
i
e
l
d
.
l
e
n
g
t
h
 
>
 
0
 
&
&
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
2
 
t
e
x
t
-
x
s
 
f
o
n
t
-
m
e
d
i
u
m
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>
N
e
t
 
P
&
L
 
b
y
 
{
a
c
t
i
v
e
F
i
e
l
d
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
b
y
F
i
e
l
d
.
m
a
p
(
(
r
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
B
a
r
R
o
w


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
k
e
y
=
{
r
.
k
e
y
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
l
a
b
e
l
=
{
r
.
k
e
y
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
v
a
l
u
e
=
{
M
a
t
h
.
a
b
s
(
r
.
s
t
a
t
s
.
n
e
t
P
n
l
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
m
a
x
=
{
M
a
t
h
.
m
a
x
(
.
.
.
b
y
F
i
e
l
d
.
m
a
p
(
(
x
)
 
=
>
 
M
a
t
h
.
a
b
s
(
x
.
s
t
a
t
s
.
n
e
t
P
n
l
)
)
,
 
1
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
d
i
s
p
l
a
y
=
{
`
$
{
f
m
t
M
o
n
e
y
(
r
.
s
t
a
t
s
.
n
e
t
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}
 
·
 
$
{
r
.
s
t
a
t
s
.
t
o
t
a
l
}
t
`
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
o
l
o
r
=
{
r
.
s
t
a
t
s
.
n
e
t
P
n
l
 
>
=
 
0
 
?
 
"
#
2
2
C
5
5
E
"
 
:
 
"
#
E
F
4
4
4
4
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
>


 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
T
i
m
i
n
g
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
p
a
c
e
-
y
-
8
"
>


 
 
 
 
 
 
 
 
 
 
{
v
i
s
i
b
l
e
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
E
m
p
t
y
S
t
a
t
e
 
t
i
t
l
e
=
"
N
o
 
t
i
m
i
n
g
 
d
a
t
a
 
y
e
t
"
 
b
o
d
y
=
"
E
a
c
h
 
t
r
a
d
e
'
s
 
e
n
t
r
y
 
t
i
m
e
s
t
a
m
p
 
d
r
i
v
e
s
 
t
h
i
s
.
 
L
o
g
 
t
r
a
d
e
s
 
t
o
 
s
e
e
 
w
h
e
n
 
y
o
u
r
 
e
d
g
e
 
a
c
t
u
a
l
l
y
 
s
h
o
w
s
 
u
p
.
"
 
/
>


 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
 
a
c
t
i
o
n
=
{
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
l
o
c
a
l
 
t
i
m
e
 
(
A
c
c
r
a
,
 
U
T
C
+
0
)
<
/
s
p
a
n
>
}
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
t
i
m
e


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
T
i
m
e
M
a
t
r
i
x
 
t
r
a
d
e
s
=
{
v
i
s
i
b
l
e
}
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>




 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
l
g
:
g
r
i
d
-
c
o
l
s
-
2
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
d
a
y
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
D
a
y
O
f
W
e
e
k
 
t
r
a
d
e
s
=
{
v
i
s
i
b
l
e
}
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
T
r
a
d
e
 
f
r
e
q
u
e
n
c
y
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
T
r
a
d
e
F
r
e
q
u
e
n
c
y
 
t
r
a
d
e
s
=
{
v
i
s
i
b
l
e
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>




 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
 
a
c
t
i
o
n
=
{
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
d
a
i
l
y
 
n
e
t
 
P
&
a
m
p
;
L
<
/
s
p
a
n
>
}
>
P
e
r
f
o
r
m
a
n
c
e
 
c
a
l
e
n
d
a
r
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
Y
e
a
r
H
e
a
t
m
a
p
 
t
r
a
d
e
s
=
{
v
i
s
i
b
l
e
}
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>




 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
b
y
H
o
u
r
.
l
e
n
g
t
h
 
>
 
0
 
&
&
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
N
e
t
 
P
&
a
m
p
;
L
 
b
y
 
e
n
t
r
y
 
h
o
u
r
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
b
y
H
o
u
r
.
m
a
p
(
(
h
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
B
a
r
R
o
w


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
k
e
y
=
{
h
.
h
o
u
r
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
l
a
b
e
l
=
{
h
o
u
r
L
a
b
e
l
(
h
.
h
o
u
r
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
v
a
l
u
e
=
{
M
a
t
h
.
a
b
s
(
h
.
s
t
a
t
s
.
n
e
t
P
n
l
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
m
a
x
=
{
M
a
t
h
.
m
a
x
(
.
.
.
b
y
H
o
u
r
.
m
a
p
(
(
x
)
 
=
>
 
M
a
t
h
.
a
b
s
(
x
.
s
t
a
t
s
.
n
e
t
P
n
l
)
)
,
 
1
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
d
i
s
p
l
a
y
=
{
`
$
{
f
m
t
M
o
n
e
y
(
h
.
s
t
a
t
s
.
n
e
t
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}
 
·
 
$
{
h
.
s
t
a
t
s
.
t
o
t
a
l
}
t
`
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
o
l
o
r
=
{
h
.
s
t
a
t
s
.
n
e
t
P
n
l
 
>
=
 
0
 
?
 
"
r
g
b
(
v
a
r
(
-
-
p
o
s
)
)
"
 
:
 
"
r
g
b
(
v
a
r
(
-
-
n
e
g
)
)
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
 
 
<
/
>


 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
E
x
i
t
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
p
a
c
e
-
y
-
6
"
>


 
 
 
 
 
 
 
 
 
 
{
e
x
i
t
D
i
s
t
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
E
m
p
t
y
S
t
a
t
e
 
t
i
t
l
e
=
"
N
o
 
e
x
i
t
 
d
a
t
a
 
y
e
t
"
 
b
o
d
y
=
"
S
e
t
 
a
n
 
e
x
i
t
 
r
e
a
s
o
n
 
o
n
 
y
o
u
r
 
t
r
a
d
e
s
 
(
T
a
k
e
 
P
r
o
f
i
t
,
 
S
t
o
p
 
L
o
s
s
,
 
B
r
e
a
k
e
v
e
n
,
 
M
a
n
u
a
l
,
 
P
a
r
t
i
a
l
)
 
t
o
 
s
e
e
 
h
o
w
 
y
o
u
 
c
l
o
s
e
.
"
 
/
>


 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
2
 
g
a
p
-
4
 
m
d
:
g
r
i
d
-
c
o
l
s
-
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
E
X
I
T
_
R
E
A
S
O
N
S
.
m
a
p
(
(
r
)
 
=
>
 
{


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
o
n
s
t
 
d
 
=
 
e
x
i
t
D
i
s
t
.
f
i
n
d
(
(
x
)
 
=
>
 
x
.
k
e
y
 
=
=
=
 
r
)
;


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
r
e
t
u
r
n
 
<
S
t
a
t
 
k
e
y
=
{
r
}
 
l
a
b
e
l
=
{
r
}
 
v
a
l
u
e
=
{
d
 
?
 
f
m
t
P
c
t
(
d
.
p
c
t
)
 
:
 
"
0
%
"
}
 
h
i
n
t
=
{
d
 
?
 
`
$
{
d
.
c
o
u
n
t
}
 
t
r
a
d
e
s
`
 
:
 
"
—
"
}
 
/
>
;


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
}
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
E
x
i
t
 
d
i
s
t
r
i
b
u
t
i
o
n
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
e
x
i
t
D
i
s
t
.
m
a
p
(
(
d
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
B
a
r
R
o
w
 
k
e
y
=
{
d
.
k
e
y
}
 
l
a
b
e
l
=
{
d
.
k
e
y
}
 
v
a
l
u
e
=
{
d
.
p
c
t
}
 
m
a
x
=
{
1
0
0
}
 
d
i
s
p
l
a
y
=
{
`
$
{
f
m
t
P
c
t
(
d
.
p
c
t
)
}
 
·
 
$
{
d
.
c
o
u
n
t
}
t
`
}
 
c
o
l
o
r
=
{
d
.
k
e
y
 
=
=
=
 
"
S
t
o
p
 
L
o
s
s
"
 
?
 
"
#
E
F
4
4
4
4
"
 
:
 
d
.
k
e
y
 
=
=
=
 
"
T
a
k
e
 
P
r
o
f
i
t
"
 
?
 
"
#
2
2
C
5
5
E
"
 
:
 
"
#
9
4
A
3
B
8
"
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
>


 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
Q
u
a
l
i
t
y
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
s
e
t
u
p
 
q
u
a
l
i
t
y
 
s
c
o
r
e
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
4
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>
H
i
g
h
e
r
 
s
c
o
r
e
s
 
s
h
o
u
l
d
 
p
r
o
d
u
c
e
 
h
i
g
h
e
r
 
e
x
p
e
c
t
a
n
c
y
.
 
I
f
 
a
 
3
 
o
u
t
-
e
a
r
n
s
 
y
o
u
r
 
5
s
,
 
r
e
c
a
l
i
b
r
a
t
e
 
w
h
a
t
 
&
q
u
o
t
;
t
e
x
t
b
o
o
k
&
q
u
o
t
;
 
m
e
a
n
s
.
<
/
p
>


 
 
 
 
 
 
 
 
 
 
{
b
y
Q
u
a
l
i
t
y
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
8
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>
S
c
o
r
e
 
s
e
t
u
p
s
 
1
–
5
 
a
s
 
y
o
u
 
l
o
g
 
t
h
e
m
 
t
o
 
p
o
p
u
l
a
t
e
 
t
h
i
s
.
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
b
y
Q
u
a
l
i
t
y
.
m
a
p
(
(
r
)
 
=
>
 
(
{
 
.
.
.
r
,
 
k
e
y
:
 
`
$
{
r
.
k
e
y
}
 
·
 
$
{
Q
U
A
L
I
T
Y
_
L
A
B
E
L
S
[
N
u
m
b
e
r
(
r
.
k
e
y
)
]
 
?
?
 
"
"
}
`
 
}
)
)
}
 
k
e
y
L
a
b
e
l
=
"
Q
u
a
l
i
t
y
 
s
c
o
r
e
"
 
/
>


 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
P
a
i
r
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
p
a
i
r
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
b
y
P
a
i
r
}
 
k
e
y
L
a
b
e
l
=
"
P
a
i
r
"
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
S
e
s
s
i
o
n
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
p
a
c
e
-
y
-
6
"
>


 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
s
e
s
s
i
o
n
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
s
m
:
g
r
i
d
-
c
o
l
s
-
2
 
x
l
:
g
r
i
d
-
c
o
l
s
-
4
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
s
s
i
o
n
R
a
d
a
r
 
t
i
t
l
e
=
"
W
i
n
 
R
a
t
e
"
 
p
o
i
n
t
s
=
{
r
a
d
a
r
P
o
i
n
t
s
(
(
s
t
)
 
=
>
 
s
t
.
w
i
n
R
a
t
e
,
 
(
v
)
 
=
>
 
f
m
t
P
c
t
(
v
)
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
s
s
i
o
n
R
a
d
a
r
 
t
i
t
l
e
=
"
T
o
t
a
l
 
T
r
a
d
e
s
"
 
p
o
i
n
t
s
=
{
r
a
d
a
r
P
o
i
n
t
s
(
(
s
t
)
 
=
>
 
s
t
.
t
o
t
a
l
,
 
(
v
)
 
=
>
 
S
t
r
i
n
g
(
M
a
t
h
.
r
o
u
n
d
(
v
)
)
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
s
s
i
o
n
R
a
d
a
r
 
t
i
t
l
e
=
"
A
v
g
 
R
R
"
 
p
o
i
n
t
s
=
{
r
a
d
a
r
P
o
i
n
t
s
(
(
s
t
)
 
=
>
 
s
t
.
a
v
g
R
R
,
 
(
v
)
 
=
>
 
`
$
{
v
.
t
o
F
i
x
e
d
(
2
)
}
R
`
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
s
s
i
o
n
R
a
d
a
r
 
t
i
t
l
e
=
"
P
r
o
f
i
t
"
 
p
o
i
n
t
s
=
{
r
a
d
a
r
P
o
i
n
t
s
(
(
s
t
)
 
=
>
 
s
t
.
n
e
t
P
n
l
,
 
(
v
)
 
=
>
 
f
m
t
M
o
n
e
y
(
v
,
 
c
u
r
r
e
n
c
y
)
)
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
3
 
t
e
x
t
-
[
1
1
p
x
]
 
t
e
x
t
-
m
u
t
e
"
>
S
e
s
s
i
o
n
s
 
a
r
e
 
s
e
t
 
f
r
o
m
 
e
a
c
h
 
t
r
a
d
e
&
a
p
o
s
;
s
 
t
i
m
e
 
(
U
T
C
 
=
 
y
o
u
r
 
A
c
c
r
a
 
l
o
c
a
l
 
t
i
m
e
)
:
 
L
o
n
d
o
n
 
0
8
:
0
0
–
1
3
:
0
0
,
 
O
v
e
r
l
a
p
 
1
3
:
0
0
–
1
6
:
0
0
,
 
N
e
w
 
Y
o
r
k
 
1
6
:
0
0
–
2
2
:
0
0
,
 
A
s
i
a
 
2
2
:
0
0
–
0
8
:
0
0
.
<
/
p
>


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
S
e
s
s
i
o
n
 
b
r
e
a
k
d
o
w
n
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
b
y
S
e
s
s
i
o
n
}
 
k
e
y
L
a
b
e
l
=
"
S
e
s
s
i
o
n
"
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
N
e
t
 
P
&
L
 
b
y
 
s
e
s
s
i
o
n
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
{
b
y
S
e
s
s
i
o
n
.
m
a
p
(
(
r
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
B
a
r
R
o
w


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
k
e
y
=
{
r
.
k
e
y
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
l
a
b
e
l
=
{
r
.
k
e
y
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
v
a
l
u
e
=
{
M
a
t
h
.
a
b
s
(
r
.
s
t
a
t
s
.
n
e
t
P
n
l
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
m
a
x
=
{
M
a
t
h
.
m
a
x
(
.
.
.
b
y
S
e
s
s
i
o
n
.
m
a
p
(
(
x
)
 
=
>
 
M
a
t
h
.
a
b
s
(
x
.
s
t
a
t
s
.
n
e
t
P
n
l
)
)
,
 
1
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
d
i
s
p
l
a
y
=
{
f
m
t
M
o
n
e
y
(
r
.
s
t
a
t
s
.
n
e
t
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
o
l
o
r
=
{
r
.
s
t
a
t
s
.
n
e
t
P
n
l
 
>
=
 
0
 
?
 
"
#
2
2
C
5
5
E
"
 
:
 
"
#
E
F
4
4
4
4
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
S
t
r
a
t
e
g
i
e
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
s
t
r
a
t
e
g
y
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
b
y
S
t
r
a
t
e
g
y
}
 
k
e
y
L
a
b
e
l
=
"
S
t
r
a
t
e
g
y
"
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
A
c
c
o
u
n
t
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
a
c
c
o
u
n
t
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
b
y
A
c
c
o
u
n
t
}
 
k
e
y
L
a
b
e
l
=
"
A
c
c
o
u
n
t
"
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
T
a
g
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e


 
 
 
 
 
 
 
 
 
 
 
 
a
c
t
i
o
n
=
{


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
T
a
b
s
 
t
a
b
s
=
{
[
"
A
l
l
"
,
 
"
S
i
n
g
l
e
 
t
a
g
s
"
,
 
"
P
a
i
r
s
 
o
f
 
t
a
g
s
"
,
 
"
T
r
i
p
l
e
s
"
]
}
 
a
c
t
i
v
e
=
{
c
o
m
b
o
S
i
z
e
}
 
o
n
C
h
a
n
g
e
=
{
s
e
t
C
o
m
b
o
S
i
z
e
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
}


 
 
 
 
 
 
 
 
 
 
>


 
 
 
 
 
 
 
 
 
 
 
 
T
a
g
s
 
&
 
c
o
m
b
i
n
a
t
i
o
n
s


 
 
 
 
 
 
 
 
 
 
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
4
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
C
o
m
b
i
n
a
t
i
o
n
s
 
n
e
e
d
 
a
t
 
l
e
a
s
t
 
2
 
t
r
a
d
e
s
 
t
o
 
a
p
p
e
a
r
.
 
T
h
i
s
 
i
s
 
w
h
e
r
e
 
t
h
e
 
s
y
s
t
e
m
 
s
h
o
w
s
 
y
o
u
 
w
h
i
c
h
 
c
o
n
f
l
u
e
n
c
e
s
 
a
c
t
u
a
l
l
y
 
p
a
y
.


 
 
 
 
 
 
 
 
 
 
<
/
p
>


 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
f
i
l
t
e
r
e
d
C
o
m
b
o
s
}
 
k
e
y
L
a
b
e
l
=
"
T
a
g
 
c
o
m
b
i
n
a
t
i
o
n
"
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
G
r
a
d
e
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
p
a
c
e
-
y
-
6
"
>


 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
P
e
r
f
o
r
m
a
n
c
e
 
b
y
 
s
e
t
u
p
 
g
r
a
d
e
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
<
p
 
c
l
a
s
s
N
a
m
e
=
"
m
b
-
4
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
T
h
e
 
t
e
s
t
 
o
f
 
g
o
o
d
 
g
r
a
d
i
n
g
:
 
y
o
u
r
 
A
+
 
s
e
t
u
p
s
 
s
h
o
u
l
d
 
o
u
t
-
e
a
r
n
 
y
o
u
r
 
B
 
a
n
d
 
C
 
s
e
t
u
p
s
.
 
I
f
 
t
h
e
y
 
d
o
n
&
a
p
o
s
;
t
,
 
y
o
u
r
 
i
d
e
a
 
o
f
 
a
n
 
A
+
 
n
e
e
d
s
 
w
o
r
k
.


 
 
 
 
 
 
 
 
 
 
 
 
<
/
p
>


 
 
 
 
 
 
 
 
 
 
 
 
{
b
y
G
r
a
d
e
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
8
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>
N
o
 
g
r
a
d
e
d
 
t
r
a
d
e
s
 
y
e
t
.
 
G
r
a
d
e
 
s
e
t
u
p
s
 
A
+
 
/
 
A
 
/
 
B
 
/
 
C
 
a
s
 
y
o
u
 
l
o
g
 
t
h
e
m
.
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
b
y
G
r
a
d
e
}
 
k
e
y
L
a
b
e
l
=
"
G
r
a
d
e
"
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
{
b
y
G
r
a
d
e
.
l
e
n
g
t
h
 
>
 
0
 
&
&
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
A
v
g
 
R
R
 
b
y
 
g
r
a
d
e
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
b
y
G
r
a
d
e
.
m
a
p
(
(
r
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
B
a
r
R
o
w


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
k
e
y
=
{
r
.
k
e
y
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
l
a
b
e
l
=
{
r
.
k
e
y
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
v
a
l
u
e
=
{
M
a
t
h
.
a
b
s
(
r
.
s
t
a
t
s
.
a
v
g
R
R
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
m
a
x
=
{
M
a
t
h
.
m
a
x
(
.
.
.
b
y
G
r
a
d
e
.
m
a
p
(
(
x
)
 
=
>
 
M
a
t
h
.
a
b
s
(
x
.
s
t
a
t
s
.
a
v
g
R
R
)
)
,
 
1
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
d
i
s
p
l
a
y
=
{
`
$
{
r
.
s
t
a
t
s
.
a
v
g
R
R
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
c
o
l
o
r
=
{
r
.
s
t
a
t
s
.
a
v
g
R
R
 
>
=
 
0
 
?
 
"
#
A
3
E
6
3
5
"
 
:
 
"
#
E
F
4
4
4
4
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
E
x
e
c
u
t
i
o
n
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
p
a
c
e
-
y
-
6
"
>


 
 
 
 
 
 
 
 
 
 
{
e
x
e
c
.
s
a
m
p
l
e
d
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
E
m
p
t
y
S
t
a
t
e


 
 
 
 
 
 
 
 
 
 
 
 
 
 
t
i
t
l
e
=
"
N
o
 
e
x
e
c
u
t
i
o
n
 
d
a
t
a
 
y
e
t
"


 
 
 
 
 
 
 
 
 
 
 
 
 
 
b
o
d
y
=
"
A
d
d
 
e
n
t
r
y
,
 
s
t
o
p
 
l
o
s
s
,
 
a
n
d
 
t
a
k
e
 
p
r
o
f
i
t
 
t
o
 
y
o
u
r
 
t
r
a
d
e
s
.
 
T
r
a
d
e
E
d
g
e
 
t
h
e
n
 
c
o
m
p
a
r
e
s
 
y
o
u
r
 
p
l
a
n
n
e
d
 
R
R
 
t
o
 
w
h
a
t
 
y
o
u
 
a
c
t
u
a
l
l
y
 
t
o
o
k
 
—
 
a
n
d
 
s
h
o
w
s
 
w
h
e
r
e
 
y
o
u
 
c
u
t
 
w
i
n
n
e
r
s
 
e
a
r
l
y
 
o
r
 
l
e
t
 
l
o
s
e
r
s
 
r
u
n
.
"


 
 
 
 
 
 
 
 
 
 
 
 
/
>


 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
<
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
2
 
g
a
p
-
4
 
m
d
:
g
r
i
d
-
c
o
l
s
-
4
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
t
a
t
 
l
a
b
e
l
=
"
T
r
a
d
e
s
 
m
e
a
s
u
r
e
d
"
 
v
a
l
u
e
=
{
S
t
r
i
n
g
(
e
x
e
c
.
s
a
m
p
l
e
d
)
}
 
h
i
n
t
=
"
w
i
t
h
 
e
n
t
r
y
/
S
L
/
T
P
"
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
t
a
t
 
l
a
b
e
l
=
"
T
a
r
g
e
t
 
c
a
p
t
u
r
e
"
 
v
a
l
u
e
=
{
f
m
t
P
c
t
(
e
x
e
c
.
a
v
g
C
a
p
t
u
r
e
 
*
 
1
0
0
)
}
 
h
i
n
t
=
"
o
f
 
p
l
a
n
n
e
d
 
R
 
o
n
 
w
i
n
n
e
r
s
"
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
t
a
t
 
l
a
b
e
l
=
"
A
v
g
 
p
l
a
n
n
e
d
 
R
R
"
 
v
a
l
u
e
=
{
`
$
{
e
x
e
c
.
a
v
g
P
l
a
n
n
e
d
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
S
t
a
t
 
l
a
b
e
l
=
"
A
v
g
 
r
e
a
l
i
z
e
d
 
R
R
"
 
v
a
l
u
e
=
{
`
$
{
e
x
e
c
.
a
v
g
R
e
a
l
i
z
e
d
.
t
o
F
i
x
e
d
(
2
)
}
R
`
}
 
t
o
n
e
=
{
e
x
e
c
.
a
v
g
R
e
a
l
i
z
e
d
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
m
d
:
g
r
i
d
-
c
o
l
s
-
2
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
f
o
n
t
-
m
e
d
i
u
m
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>
C
u
t
 
w
i
n
n
e
r
s
 
e
a
r
l
y
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
2
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
t
e
x
t
-
w
a
r
n
"
>
{
e
x
e
c
.
c
u
t
E
a
r
l
y
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
~
{
e
x
e
c
.
c
u
t
E
a
r
l
y
C
o
s
t
R
.
t
o
F
i
x
e
d
(
1
)
}
R
 
l
e
f
t
 
o
n
 
t
h
e
 
t
a
b
l
e
.
 
Y
o
u
r
 
w
i
n
n
e
r
s
 
c
a
n
 
t
a
k
e
 
m
o
r
e
 
r
o
o
m
.


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
f
o
n
t
-
m
e
d
i
u
m
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>
L
e
t
 
l
o
s
e
r
s
 
r
u
n
 
p
a
s
t
 
s
t
o
p
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
2
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
t
e
x
t
-
n
e
g
"
>
{
e
x
e
c
.
l
e
t
R
u
n
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
~
{
e
x
e
c
.
l
e
t
R
u
n
C
o
s
t
R
.
t
o
F
i
x
e
d
(
1
)
}
R
 
o
f
 
a
v
o
i
d
a
b
l
e
 
d
a
m
a
g
e
 
f
r
o
m
 
m
o
v
e
d
 
s
t
o
p
s
 
o
r
 
o
v
e
r
s
i
z
i
n
g
.


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
 
c
l
a
s
s
N
a
m
e
=
"
p
-
0
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
o
v
e
r
f
l
o
w
-
x
-
a
u
t
o
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
a
b
l
e
 
c
l
a
s
s
N
a
m
e
=
"
w
-
f
u
l
l
 
t
e
x
t
-
s
m
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
h
e
a
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
r
 
c
l
a
s
s
N
a
m
e
=
"
b
o
r
d
e
r
-
b
 
b
o
r
d
e
r
-
e
d
g
e
 
t
e
x
t
-
l
e
f
t
 
t
e
x
t
-
x
s
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
h
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
2
.
5
 
p
l
-
5
 
p
r
-
4
 
f
o
n
t
-
m
e
d
i
u
m
"
>
P
a
i
r
<
/
t
h
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
h
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
2
.
5
 
p
r
-
4
 
f
o
n
t
-
m
e
d
i
u
m
 
t
e
x
t
-
r
i
g
h
t
"
>
P
l
a
n
n
e
d
<
/
t
h
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
h
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
2
.
5
 
p
r
-
4
 
f
o
n
t
-
m
e
d
i
u
m
 
t
e
x
t
-
r
i
g
h
t
"
>
R
e
a
l
i
z
e
d
<
/
t
h
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
h
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
2
.
5
 
p
r
-
4
 
f
o
n
t
-
m
e
d
i
u
m
 
t
e
x
t
-
r
i
g
h
t
"
>
C
a
p
t
u
r
e
<
/
t
h
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
h
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
2
.
5
 
p
r
-
5
 
f
o
n
t
-
m
e
d
i
u
m
"
>
R
e
a
d
<
/
t
h
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
t
r
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
t
h
e
a
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
b
o
d
y
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
e
x
e
c
F
i
n
d
i
n
g
s


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
.
f
i
l
t
e
r
(
(
f
)
 
=
>
 
f
.
k
i
n
d
 
=
=
=
 
"
c
u
t
_
e
a
r
l
y
"
 
|
|
 
f
.
k
i
n
d
 
=
=
=
 
"
l
e
t
_
r
u
n
"
)


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
.
s
l
i
c
e
(
0
,
 
2
0
)


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
.
m
a
p
(
(
f
)
 
=
>
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
r
 
k
e
y
=
{
f
.
t
r
a
d
e
.
i
d
}
 
c
l
a
s
s
N
a
m
e
=
"
b
o
r
d
e
r
-
b
 
b
o
r
d
e
r
-
e
d
g
e
/
5
0
 
l
a
s
t
:
b
o
r
d
e
r
-
0
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
d
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
3
 
p
l
-
5
 
p
r
-
4
 
f
o
n
t
-
m
e
d
i
u
m
 
t
e
x
t
-
i
n
k
"
>
{
f
.
t
r
a
d
e
.
p
a
i
r
}
<
/
t
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
d
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
3
 
p
r
-
4
 
t
e
x
t
-
r
i
g
h
t
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
s
u
b
"
>
{
f
.
p
l
a
n
n
e
d
.
t
o
F
i
x
e
d
(
2
)
}
R
<
/
t
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
d
 
c
l
a
s
s
N
a
m
e
=
{
`
p
y
-
3
 
p
r
-
4
 
t
e
x
t
-
r
i
g
h
t
 
f
o
n
t
-
m
o
n
o
 
$
{
s
i
g
n
C
o
l
o
r
(
f
.
r
e
a
l
i
z
e
d
)
}
`
}
>
{
f
m
t
R
(
f
.
r
e
a
l
i
z
e
d
)
}
<
/
t
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
d
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
3
 
p
r
-
4
 
t
e
x
t
-
r
i
g
h
t
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
s
u
b
"
>
{
f
m
t
P
c
t
(
f
.
c
a
p
t
u
r
e
 
*
 
1
0
0
)
}
<
/
t
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
t
d
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
3
 
p
r
-
5
"
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
s
p
a
n
 
c
l
a
s
s
N
a
m
e
=
{
f
.
k
i
n
d
 
=
=
=
 
"
c
u
t
_
e
a
r
l
y
"
 
?
 
"
t
e
x
t
-
w
a
r
n
"
 
:
 
"
t
e
x
t
-
n
e
g
"
}
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
{
f
.
k
i
n
d
 
=
=
=
 
"
c
u
t
_
e
a
r
l
y
"
 
?
 
"
C
u
t
 
e
a
r
l
y
"
 
:
 
"
R
a
n
 
p
a
s
t
 
s
t
o
p
"
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
s
p
a
n
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
t
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
t
r
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
)
)
}


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
t
b
o
d
y
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
t
a
b
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
>


 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}




 
 
 
 
 
 
{
t
a
b
 
=
=
=
 
"
V
i
o
l
a
t
i
o
n
s
"
 
&
&
 
(


 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
s
p
a
c
e
-
y
-
6
"
>


 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
g
r
i
d
 
g
r
i
d
-
c
o
l
s
-
1
 
g
a
p
-
4
 
m
d
:
g
r
i
d
-
c
o
l
s
-
2
"
>


 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
f
o
n
t
-
m
e
d
i
u
m
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>
R
u
l
e
-
f
o
l
l
o
w
i
n
g
 
t
r
a
d
e
s
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
{
`
m
t
-
2
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
$
{
s
i
g
n
C
o
l
o
r
(
c
l
e
a
n
S
t
a
t
s
.
n
e
t
P
n
l
)
}
`
}
>
{
f
m
t
M
o
n
e
y
(
c
l
e
a
n
S
t
a
t
s
.
n
e
t
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
{
c
l
e
a
n
S
t
a
t
s
.
t
o
t
a
l
}
 
t
r
a
d
e
s
 
·
 
{
f
m
t
P
c
t
(
c
l
e
a
n
S
t
a
t
s
.
w
i
n
R
a
t
e
)
}
 
w
i
n
 
r
a
t
e
 
·
 
{
c
l
e
a
n
S
t
a
t
s
.
a
v
g
R
R
.
t
o
F
i
x
e
d
(
2
)
}
R
 
e
x
p
e
c
t
a
n
c
y
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
t
e
x
t
-
x
s
 
f
o
n
t
-
m
e
d
i
u
m
 
u
p
p
e
r
c
a
s
e
 
t
r
a
c
k
i
n
g
-
w
i
d
e
r
 
t
e
x
t
-
m
u
t
e
"
>
T
r
a
d
e
s
 
w
i
t
h
 
v
i
o
l
a
t
i
o
n
s
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
{
`
m
t
-
2
 
f
o
n
t
-
m
o
n
o
 
t
e
x
t
-
2
x
l
 
f
o
n
t
-
s
e
m
i
b
o
l
d
 
$
{
s
i
g
n
C
o
l
o
r
(
d
i
r
t
y
S
t
a
t
s
.
n
e
t
P
n
l
)
}
`
}
>
{
f
m
t
M
o
n
e
y
(
d
i
r
t
y
S
t
a
t
s
.
n
e
t
P
n
l
,
 
c
u
r
r
e
n
c
y
)
}
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
m
t
-
1
 
t
e
x
t
-
x
s
 
t
e
x
t
-
m
u
t
e
"
>
{
d
i
r
t
y
S
t
a
t
s
.
t
o
t
a
l
}
 
t
r
a
d
e
s
 
·
 
{
f
m
t
P
c
t
(
d
i
r
t
y
S
t
a
t
s
.
w
i
n
R
a
t
e
)
}
 
w
i
n
 
r
a
t
e
 
·
 
{
d
i
r
t
y
S
t
a
t
s
.
a
v
g
R
R
.
t
o
F
i
x
e
d
(
2
)
}
R
 
e
x
p
e
c
t
a
n
c
y
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
<
C
a
r
d
>


 
 
 
 
 
 
 
 
 
 
 
 
<
S
e
c
t
i
o
n
T
i
t
l
e
>
I
m
p
a
c
t
 
b
y
 
v
i
o
l
a
t
i
o
n
<
/
S
e
c
t
i
o
n
T
i
t
l
e
>


 
 
 
 
 
 
 
 
 
 
 
 
{
v
i
o
l
a
t
i
o
n
R
o
w
s
.
l
e
n
g
t
h
 
=
=
=
 
0
 
?
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
d
i
v
 
c
l
a
s
s
N
a
m
e
=
"
p
y
-
8
 
t
e
x
t
-
c
e
n
t
e
r
 
t
e
x
t
-
s
m
 
t
e
x
t
-
m
u
t
e
"
>
N
o
 
r
u
l
e
 
v
i
o
l
a
t
i
o
n
s
 
l
o
g
g
e
d
.
 
K
e
e
p
 
i
t
 
t
h
a
t
 
w
a
y
.
<
/
d
i
v
>


 
 
 
 
 
 
 
 
 
 
 
 
)
 
:
 
(


 
 
 
 
 
 
 
 
 
 
 
 
 
 
<
G
r
o
u
p
T
a
b
l
e
 
r
o
w
s
=
{
v
i
o
l
a
t
i
o
n
R
o
w
s
}
 
k
e
y
L
a
b
e
l
=
"
V
i
o
l
a
t
i
o
n
"
 
c
u
r
r
e
n
c
y
=
{
c
u
r
r
e
n
c
y
}
 
/
>


 
 
 
 
 
 
 
 
 
 
 
 
)
}


 
 
 
 
 
 
 
 
 
 
<
/
C
a
r
d
>


 
 
 
 
 
 
 
 
<
/
d
i
v
>


 
 
 
 
 
 
)
}


 
 
 
 
 
 
<
/
>


 
 
 
 
 
 
)
}


 
 
 
 
<
/
d
i
v
>


 
 
)
;


}


