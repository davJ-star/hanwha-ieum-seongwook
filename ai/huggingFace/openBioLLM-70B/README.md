## 로그인 실패
```bash
pip install -U "huggingface_hub[cli]"
huggingface-cli login
```

## 강제 로그인
huggingface-cli login이 안돼서 강제 로그인을 진행했다.

```python 
from huggingface_hub import login
login()
```
python ./login.py 입력하고 바로 토큰 입력후 로그인 완료. 

### 그외 방법들

- Set an environment variable:
```bash
export HF_TOKEN=your_token_here
```

- Pass the token directly in your code:
```python
from huggingface_hub import HfApi
api = HfApi(token="your_token_here")
```