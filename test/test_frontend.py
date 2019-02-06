from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

"""

driver = webdriver.Chrome()
driver.get('https://10.30.90.98/platform')


try:
    WebDriverWait(driver, 10).until(EC.title_contains('GeoImageNet'))
    button = driver.find_element_by_xpath('(//div[@id="actions"]/button)[2]')
    button.click()

finally:
    driver.quit()

"""
